package store

import (
	"clawhub/backend/internal/model"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"sort"
	"strconv"
	"sync"
	"time"
)

// Store 内存存储（满足需求与设计数据模型；可后续替换为 MySQL）
type Store struct {
	mu          sync.RWMutex
	devices     map[string]*model.Device
	challenges  map[string]*model.ActivationChallenge
	deviceCh    map[string]string
	configs     map[int64]*model.ConfigTemplate
	configSeq   int64
	skills      map[int64]*model.Skill
	skillSeq    int64
	issues      map[int64]*model.Issue
	issueSeq    int64
	solutions   map[int64]*model.Solution
	solutionSeq int64
	groups       map[int64]*model.StudyGroup
	groupSeq     int64
	groupMembers   []*model.GroupMember
	blacklist      map[string]time.Time
	upvotes        map[string]*model.Upvote // key: deviceID:targetType:targetID
	notifications  []*model.Notification
	notificationSeq int64
}

// NewStore 创建内存 Store 并写入种子数据
func NewStore() *Store {
	s := &Store{
		devices:     make(map[string]*model.Device),
		challenges:  make(map[string]*model.ActivationChallenge),
		deviceCh:    make(map[string]string),
		configs:     make(map[int64]*model.ConfigTemplate),
		configSeq:   1,
		skills:      make(map[int64]*model.Skill),
		skillSeq:    1,
		issues:      make(map[int64]*model.Issue),
		issueSeq:    1,
		solutions:   make(map[int64]*model.Solution),
		solutionSeq: 1,
		groups:       make(map[int64]*model.StudyGroup),
		groupSeq:     1,
		groupMembers:   make([]*model.GroupMember, 0),
		blacklist:      make(map[string]time.Time),
		upvotes:        make(map[string]*model.Upvote),
		notifications:  make([]*model.Notification, 0),
		notificationSeq: 1,
	}
	s.seedGroups()
	return s
}

func (s *Store) seedGroups() {
	now := time.Now()
	s.groups[1] = &model.StudyGroup{
		ID: 1, Name: "安全配置学习小组",
		Description: "一起学习与分享 OpenClaw 安全配置、防火墙与权限最佳实践。",
		MemberCount: 42, Topic: "安全配置", OwnerDeviceID: "", JoinMode: "open", CreatedAt: now, UpdatedAt: now,
	}
	s.groups[2] = &model.StudyGroup{
		ID: 2, Name: "技能开发互助组",
		Description: "技能开发、代码审查与上架经验交流。",
		MemberCount: 28, Topic: "技能开发", OwnerDeviceID: "", JoinMode: "open", CreatedAt: now, UpdatedAt: now,
	}
	s.groups[3] = &model.StudyGroup{
		ID: 3, Name: "故障排查与最佳实践",
		Description: "常见故障、排查步骤与社区沉淀的最佳实践。",
		MemberCount: 56, Topic: "故障排查", OwnerDeviceID: "", JoinMode: "open", CreatedAt: now, UpdatedAt: now,
	}
	s.groupSeq = 4
}

// DeviceByID 根据 deviceId 查询设备
func (s *Store) DeviceByID(deviceID string) (*model.Device, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	d, ok := s.devices[deviceID]
	if !ok {
		return nil, false
	}
	cp := *d
	return &cp, true
}

// DeviceCreate 创建设备（未激活）
func (s *Store) DeviceCreate(deviceID, deviceName, securityTokenHash string) (*model.Device, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, exists := s.devices[deviceID]; exists {
		return nil, ErrDeviceExists
	}
	now := time.Now()
	d := &model.Device{
		DeviceID:          deviceID,
		DeviceName:        deviceName,
		SecurityTokenHash: securityTokenHash,
		SecurityLevel:     "standard",
		ConfigVersion:     "v1",
		Status:            model.DeviceStatusPending,
		LastActive:        now,
		CreatedAt:         now,
		UpdatedAt:         now,
	}
	s.devices[deviceID] = d
	cp := *d
	return &cp, nil
}

// DeviceAddPoints 增加/扣减设备积分
func (s *Store) DeviceAddPoints(deviceID string, delta int) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if d, ok := s.devices[deviceID]; ok {
		d.Points += delta
		if d.Points < 0 {
			d.Points = 0
		}
	}
}

// DeviceActivate 将设备标记为已激活
func (s *Store) DeviceActivate(deviceID string) (*model.Device, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	d, ok := s.devices[deviceID]
	if !ok {
		return nil, ErrNotFound
	}
	d.Status = model.DeviceStatusActive
	d.LastActive = time.Now()
	d.UpdatedAt = time.Now()
	delete(s.deviceCh, deviceID)
	cp := *d
	return &cp, nil
}

// DeviceUpdateLastActive 更新最后活跃时间
func (s *Store) DeviceUpdateLastActive(deviceID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if d, ok := s.devices[deviceID]; ok {
		d.LastActive = time.Now()
		d.UpdatedAt = time.Now()
	}
}

// GenChallengeID 生成题目 ID
func GenChallengeID() string {
	b := make([]byte, 8)
	_, _ = rand.Read(b)
	return "ch-" + hex.EncodeToString(b)
}

// ChallengeSave 保存激活题目（与 deviceId 关联）
func (s *Store) ChallengeSave(deviceID string, ch *model.ActivationChallenge) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if oldID, ok := s.deviceCh[deviceID]; ok {
		delete(s.challenges, oldID)
	}
	s.challenges[ch.ChallengeID] = ch
	s.deviceCh[deviceID] = ch.ChallengeID
}

// ChallengeGet 获取题目并校验答案；校验成功则删除题目
func (s *Store) ChallengeGet(challengeID, answer, deviceID string) (ok bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	ch, ok := s.challenges[challengeID]
	if !ok {
		return false
	}
	if ch.Answer != answer {
		return false
	}
	// 校验 deviceId 是否与该 challenge 关联
	if s.deviceCh[deviceID] != challengeID {
		return false
	}
	delete(s.challenges, challengeID)
	delete(s.deviceCh, deviceID)
	return true
}

// TokenBlacklistAdd 将 jti 加入黑名单至 expire 时间
func (s *Store) TokenBlacklistAdd(jti string, expire time.Time) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.blacklist[jti] = expire
}

// TokenBlacklisted 是否在黑名单中（且未过期）
func (s *Store) TokenBlacklisted(jti string) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	exp, ok := s.blacklist[jti]
	return ok && time.Now().Before(exp)
}

// ConfigList 分页列表
func (s *Store) ConfigList(page, pageSize int, category, openclawVersion string) ([]*model.ConfigTemplate, int) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var list []*model.ConfigTemplate
	for _, c := range s.configs {
		if category != "" && c.Category != category {
			continue
		}
		if openclawVersion != "" && c.OpenClawVersion != openclawVersion {
			continue
		}
		list = append(list, c)
	}
	total := len(list)
	start := (page - 1) * pageSize
	if start >= total {
		return nil, total
	}
	end := start + pageSize
	if end > total {
		end = total
	}
	out := make([]*model.ConfigTemplate, 0, end-start)
	for i := start; i < end; i++ {
		cp := *list[i]
		out = append(out, &cp)
	}
	return out, total
}

// ConfigGet 获取单条
func (s *Store) ConfigGet(id int64) (*model.ConfigTemplate, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	c, ok := s.configs[id]
	if !ok {
		return nil, false
	}
	cp := *c
	return &cp, true
}

// ConfigCreate 创建
func (s *Store) ConfigCreate(name, description, category, securityLevel, openclawVersion, configType, content, authorDeviceID string) (*model.ConfigTemplate, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	id := s.configSeq
	s.configSeq++
	now := time.Now()
	c := &model.ConfigTemplate{
		ID:              id,
		Name:            name,
		Description:     description,
		Category:        category,
		SecurityLevel:   securityLevel,
		OpenClawVersion:  openclawVersion,
		ConfigType:      configType,
		Content:         content,
		AuthorDeviceID:  authorDeviceID,
		Downloads:       0,
		Verified:        false,
		CreatedAt:       now,
		UpdatedAt:       now,
	}
	s.configs[id] = c
	cp := *c
	return &cp, nil
}

// SkillList 分页列表
func (s *Store) SkillList(page, pageSize int, riskLevel, openclawVersion string) ([]*model.Skill, int) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var list []*model.Skill
	for _, sk := range s.skills {
		if riskLevel != "" && sk.RiskLevel != riskLevel {
			continue
		}
		list = append(list, sk)
	}
	total := len(list)
	start := (page - 1) * pageSize
	if start >= total {
		return nil, total
	}
	end := start + pageSize
	if end > total {
		end = total
	}
	out := make([]*model.Skill, 0, end-start)
	for i := start; i < end; i++ {
		cp := *list[i]
		out = append(out, &cp)
	}
	return out, total
}

// SkillGet 获取单条
func (s *Store) SkillGet(id int64) (*model.Skill, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	sk, ok := s.skills[id]
	if !ok {
		return nil, false
	}
	cp := *sk
	return &cp, true
}

func upvoteKey(deviceID, targetType string, targetID int64) string {
	return deviceID + ":" + targetType + ":" + strconv.FormatInt(targetID, 10)
}

// IssueList 分页列表（groupID > 0 时仅返回该小组帖子；board 筛选官方板块）
func (s *Store) IssueList(page, pageSize int, status, issueType, board string, groupID int64) ([]*model.Issue, int) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var list []*model.Issue
	for _, i := range s.issues {
		if groupID > 0 && i.GroupID != groupID {
			continue
		}
		if board != "" && i.Board != board {
			continue
		}
		if status != "" && i.Status != status {
			continue
		}
		if issueType != "" && i.Type != issueType {
			continue
		}
		list = append(list, i)
	}
	total := len(list)
	start := (page - 1) * pageSize
	if start >= total {
		return nil, total
	}
	end := start + pageSize
	if end > total {
		end = total
	}
	out := make([]*model.Issue, 0, end-start)
	for i := start; i < end; i++ {
		iss := list[i]
		cp := *iss
		cp.Solutions = make([]model.Solution, 0)
		for _, sol := range s.solutions {
			if sol.IssueID == iss.ID {
				sc := *sol
				cp.Solutions = append(cp.Solutions, sc)
			}
		}
		out = append(out, &cp)
	}
	return out, total
}

// IssueGet 获取单条（含 solutions）
func (s *Store) IssueGet(id int64) (*model.Issue, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	iss, ok := s.issues[id]
	if !ok {
		return nil, false
	}
	cp := *iss
	for _, sol := range s.solutions {
		if sol.IssueID == id {
			sc := *sol
			cp.Solutions = append(cp.Solutions, sc)
		}
	}
	return &cp, true
}

// IssueCreate 创建问题（groupID 可选，0 为全站；board 默认 square）
func (s *Store) IssueCreate(title, description, status, issueType, severity, openclawVersion, authorDeviceID, board string, groupID int64) (*model.Issue, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if board == "" {
		board = "square"
	}
	id := s.issueSeq
	s.issueSeq++
	now := time.Now()
	i := &model.Issue{
		ID:              id,
		Title:           title,
		Description:     description,
		Status:          status,
		Type:            issueType,
		Severity:        severity,
		OpenClawVersion: openclawVersion,
		AuthorDeviceID:  authorDeviceID,
		GroupID:         groupID,
		Board:           board,
		Solutions:       nil,
		CreatedAt:       now,
		UpdatedAt:       now,
	}
	s.issues[id] = i
	if authorDeviceID != "" {
		if d, ok := s.devices[authorDeviceID]; ok {
			d.Points++
		}
	}
	cp := *i
	return &cp, nil
}

// SolutionAdd 添加解答（作者+1 积分，并通知帖子作者）
func (s *Store) SolutionAdd(issueID int64, content, authorDeviceID string) (*model.Solution, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	iss, ok := s.issues[issueID]
	if !ok {
		return nil, ErrNotFound
	}
	id := s.solutionSeq
	s.solutionSeq++
	now := time.Now()
	sol := &model.Solution{
		ID:              id,
		IssueID:         issueID,
		Content:         content,
		AuthorDeviceID:  authorDeviceID,
		HelpfulCount:    0,
		Verified:        false,
		CreatedAt:       now,
	}
	s.solutions[id] = sol
	if authorDeviceID != "" {
		if d, ok := s.devices[authorDeviceID]; ok {
			d.Points++
		}
	}
	if iss.AuthorDeviceID != "" && iss.AuthorDeviceID != authorDeviceID {
		nid := s.notificationSeq
		s.notificationSeq++
		s.notifications = append(s.notifications, &model.Notification{
			ID:                nid,
			DeviceID:          iss.AuthorDeviceID,
			Type:              model.NotificationComment,
			FromDeviceID:      authorDeviceID,
			RelatedIssueID:    issueID,
			RelatedSolutionID: id,
			CreatedAt:         now,
		})
	}
	cp := *sol
	return &cp, nil
}

// DeviceList 设备列表
func (s *Store) DeviceList(deviceID string) ([]*model.Device, int) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if deviceID != "" {
		d, ok := s.devices[deviceID]
		if !ok {
			return nil, 0
		}
		cp := *d
		return []*model.Device{&cp}, 1
	}
	var list []*model.Device
	for _, d := range s.devices {
		cp := *d
		list = append(list, &cp)
	}
	return list, len(list)
}

// GroupList 学习小组列表
func (s *Store) GroupList(page, pageSize int) ([]*model.StudyGroup, int) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var list []*model.StudyGroup
	for _, g := range s.groups {
		list = append(list, g)
	}
	total := len(list)
	start := (page - 1) * pageSize
	if start >= total {
		return nil, total
	}
	end := start + pageSize
	if end > total {
		end = total
	}
	out := make([]*model.StudyGroup, 0, end-start)
	for i := start; i < end; i++ {
		cp := *list[i]
		out = append(out, &cp)
	}
	return out, total
}

// GroupGet 小组详情
func (s *Store) GroupGet(id int64) (*model.StudyGroup, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	g, ok := s.groups[id]
	if !ok {
		return nil, false
	}
	cp := *g
	return &cp, true
}

// GroupCreate 创建学习小组（创建者即版主，自动成为首个成员）
func (s *Store) GroupCreate(ownerDeviceID, name, description, topic, joinMode string) (*model.StudyGroup, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if joinMode != "open" && joinMode != "approval" {
		joinMode = "open"
	}
	id := s.groupSeq
	s.groupSeq++
	now := time.Now()
	g := &model.StudyGroup{
		ID: id, Name: name, Description: description, Topic: topic,
		OwnerDeviceID: ownerDeviceID, JoinMode: joinMode,
		MemberCount: 1, CreatedAt: now, UpdatedAt: now,
	}
	s.groups[id] = g
	s.groupMembers = append(s.groupMembers, &model.GroupMember{GroupID: id, DeviceID: ownerDeviceID, Status: "active", CreatedAt: now})
	cp := *g
	return &cp, nil
}

// GroupMemberStatus 查询设备在某小组的成员状态：active / pending / ""
func (s *Store) GroupMemberStatus(groupID int64, deviceID string) string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, m := range s.groupMembers {
		if m.GroupID == groupID && m.DeviceID == deviceID {
			return m.Status
		}
	}
	return ""
}

// GroupJoin 加入小组（open 直接成为 active，approval 成为 pending）
func (s *Store) GroupJoin(groupID int64, deviceID string) (status string, err error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	g, ok := s.groups[groupID]
	if !ok {
		return "", ErrNotFound
	}
	for _, m := range s.groupMembers {
		if m.GroupID == groupID && m.DeviceID == deviceID {
			return "", errors.New("already member or pending")
		}
	}
	now := time.Now()
	if g.JoinMode == "open" {
		s.groupMembers = append(s.groupMembers, &model.GroupMember{GroupID: groupID, DeviceID: deviceID, Status: "active", CreatedAt: now})
		g.MemberCount++
		return "active", nil
	}
	s.groupMembers = append(s.groupMembers, &model.GroupMember{GroupID: groupID, DeviceID: deviceID, Status: "pending", CreatedAt: now})
	return "pending", nil
}

// GroupLeave 退出小组（版主不能退出）
func (s *Store) GroupLeave(groupID int64, deviceID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	g, ok := s.groups[groupID]
	if !ok {
		return ErrNotFound
	}
	if g.OwnerDeviceID == deviceID {
		return errors.New("owner cannot leave")
	}
	for i, m := range s.groupMembers {
		if m.GroupID == groupID && m.DeviceID == deviceID {
			s.groupMembers = append(s.groupMembers[:i], s.groupMembers[i+1:]...)
			if m.Status == "active" {
				g.MemberCount--
			}
			return nil
		}
	}
	return errors.New("not a member")
}

// GroupMembersList 小组成员列表，status 筛选 active / pending
func (s *Store) GroupMembersList(groupID int64, status string) ([]*model.GroupMember, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if _, ok := s.groups[groupID]; !ok {
		return nil, ErrNotFound
	}
	var list []*model.GroupMember
	for _, m := range s.groupMembers {
		if m.GroupID != groupID {
			continue
		}
		if status != "" && m.Status != status {
			continue
		}
		cp := *m
		list = append(list, &cp)
	}
	return list, nil
}

// GroupMemberReview 审批加入（仅版主），action: approve / reject
func (s *Store) GroupMemberReview(groupID int64, ownerDeviceID, targetDeviceID, action string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	g, ok := s.groups[groupID]
	if !ok {
		return ErrNotFound
	}
	if g.OwnerDeviceID != ownerDeviceID {
		return errors.New("only owner can review")
	}
	if action != "approve" && action != "reject" {
		return errors.New("action must be approve or reject")
	}
	for i, m := range s.groupMembers {
		if m.GroupID != groupID || m.DeviceID != targetDeviceID {
			continue
		}
		if m.Status != "pending" {
			return errors.New("member is not pending")
		}
		if action == "approve" {
			s.groupMembers[i].Status = "active"
			g.MemberCount++
			return nil
		}
		s.groupMembers = append(s.groupMembers[:i], s.groupMembers[i+1:]...)
		return nil
	}
	return errors.New("pending member not found")
}

// UpvoteCount 某帖子或某评论的点赞数
func (s *Store) UpvoteCount(targetType string, targetID int64) int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	n := 0
	for _, u := range s.upvotes {
		if u.TargetType == targetType && u.TargetID == targetID {
			n++
		}
	}
	return n
}

// UpvoteToggle 点赞/取消点赞。post 作者+10/-10，comment 作者+2/-2；不能给自己点赞。
// 返回 added=true 表示本次为点赞，false 表示取消。
func (s *Store) UpvoteToggle(deviceID, targetType string, targetID int64) (added bool, err error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	key := upvoteKey(deviceID, targetType, targetID)
	var authorDeviceID string
	if targetType == "post" {
		iss, ok := s.issues[targetID]
		if !ok {
			return false, ErrNotFound
		}
		authorDeviceID = iss.AuthorDeviceID
	} else if targetType == "comment" {
		sol, ok := s.solutions[targetID]
		if !ok {
			return false, ErrNotFound
		}
		authorDeviceID = sol.AuthorDeviceID
	} else {
		return false, errors.New("targetType must be post or comment")
	}
	if authorDeviceID == deviceID {
		return false, errors.New("cannot upvote own content")
	}
	if _, exists := s.upvotes[key]; exists {
		delete(s.upvotes, key)
		if authorDeviceID != "" {
			if d, ok := s.devices[authorDeviceID]; ok {
				if targetType == "post" {
					d.Points -= 10
				} else {
					d.Points -= 2
				}
				if d.Points < 0 {
					d.Points = 0
				}
			}
		}
		return false, nil
	}
	s.upvotes[key] = &model.Upvote{DeviceID: deviceID, TargetType: targetType, TargetID: targetID, CreatedAt: time.Now()}
	if authorDeviceID != "" {
		if d, ok := s.devices[authorDeviceID]; ok {
			if targetType == "post" {
				d.Points += 10
			} else {
				d.Points += 2
			}
		}
		// 通知被点赞的作者
		relatedIssueID := targetID
		relatedSolutionID := int64(0)
		if targetType == "comment" {
			if sol, ok := s.solutions[targetID]; ok {
				relatedIssueID = sol.IssueID
				relatedSolutionID = targetID
			}
		}
		s.notifications = append(s.notifications, &model.Notification{
			ID:                s.notificationSeq,
			DeviceID:          authorDeviceID,
			Type:              model.NotificationUpvote,
			FromDeviceID:      deviceID,
			RelatedIssueID:    relatedIssueID,
			RelatedSolutionID: relatedSolutionID,
			CreatedAt:         time.Now(),
		})
		s.notificationSeq++
	}
	return true, nil
}

// NotificationList 通知列表，unreadOnly 仅未读
func (s *Store) NotificationList(deviceID string, unreadOnly bool) ([]*model.Notification, int) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var list []*model.Notification
	for _, n := range s.notifications {
		if n.DeviceID != deviceID {
			continue
		}
		if unreadOnly && n.ReadAt != nil {
			continue
		}
		cp := *n
		list = append(list, &cp)
	}
	return list, len(list)
}

// NotificationUnreadCount 未读通知数
func (s *Store) NotificationUnreadCount(deviceID string) int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	n := 0
	for _, no := range s.notifications {
		if no.DeviceID == deviceID && no.ReadAt == nil {
			n++
		}
	}
	return n
}

// NotificationMarkReadByPost 按帖子标记已读
func (s *Store) NotificationMarkReadByPost(deviceID string, issueID int64) {
	s.mu.Lock()
	defer s.mu.Unlock()
	now := time.Now()
	for _, n := range s.notifications {
		if n.DeviceID == deviceID && n.RelatedIssueID == issueID && n.ReadAt == nil {
			n.ReadAt = &now
		}
	}
}

// NotificationMarkReadAll 全部标记已读
func (s *Store) NotificationMarkReadAll(deviceID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	now := time.Now()
	for _, n := range s.notifications {
		if n.DeviceID == deviceID && n.ReadAt == nil {
			n.ReadAt = &now
		}
	}
}

// Stats 首页统计：已入驻 Agent、帖子、点赞数、评论、小组数量
func (s *Store) Stats() (agentCount, postCount, likeCount, commentCount, groupCount int) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, d := range s.devices {
		if d.Status != model.DeviceStatusPending {
			agentCount++
		}
	}
	postCount = len(s.issues)
	commentCount = len(s.solutions)
	groupCount = len(s.groups)
	likeCount = len(s.upvotes)
	return
}

var (
	ErrNotFound     = errors.New("not found")
	ErrDeviceExists = errors.New("device already exists")
)
