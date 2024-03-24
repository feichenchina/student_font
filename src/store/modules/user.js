import { login, logout } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  getTokenType,
  setTokenType,
  removeTokenType,
  getName,
  setName,
  getRole,
  setRole
} from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  tokenType: getTokenType(),
  id: 0,
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TOKEN_TYPE: (state, type) => {
    state.tokenType = type
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, type } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password, type })
        .then((response) => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          commit('SET_TOKEN_TYPE', data.type)
          commit('SET_NAME', data.info.name)
          commit('SET_ROLES', data.type)
          setToken(data.token)
          setTokenType(data.type)
          setName(data.info.name)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(getTokenType())
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_TOKEN_TYPE', '')
          commit('SET_ROLES', [])
          removeToken()
          removeTokenType()


          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
