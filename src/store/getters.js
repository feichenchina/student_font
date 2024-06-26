const getters = {
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.user.token,
  tokenType: (state) => state.user.tokenType,
  avatar: (state) => state.user.avatar,
  id: (state) => state.user.id,
  name: (state) => state.name,
  introduction: (state) => state.user.introduction,
  roles: (state) => state.tokenType,
  permission_routes: (state) => state.permission.routes,
  errorLogs: (state) => state.errorLog.logs,
  chatStudentIds: (state) => state.chat.studentIds,
  chatTeacherIds: (state) => state.chat.teacherIds,
}
export default getters
