import storage from 'good-storage'
const app = {
  namespaced: true,
  state: {
    sidebar: {
      collapse: false
    },
    device: 'desktop',
    adminStep: storage.session.get('ADMIN_STEP', 1),
    publishStep: storage.session.get('PUBLISH_STEP', 1),
    unfinishFlag: storage.session.get('UNFINISH_FLAG', false),
    unfinishId: storage.session.get('UNFINISH_ID', 0)
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar.collapse = !state.sidebar.collapse
    },
    CLOSE_SIDEBAR: state => {
      state.sidebar.collapse = true
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_ADMIN_STEP: (state, step) => {
      state.adminStep = step
    },
    SET_PUBLISH_STEP: (state, step) => {
      state.publishStep = step
    },
    SET_UNFINISH_FLAG: (state, flag) => {
      state.unfinishFlag = flag
    },
    SET_UNFINISH_ID: (state, id) => {
      state.unfinishId = id
    }
  },
  actions: {
    toggleSideBar ({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar ({ commit }) {
      commit('CLOSE_SIDEBAR')
    },
    toggleDevice ({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setAdminStep ({ commit }, step) {
      commit('SET_ADMIN_STEP', step)
      storage.session.set('ADMIN_STEP', step)
    },
    setPublishStep ({ commit }, step) {
      commit('SET_PUBLISH_STEP', step)
      storage.session.set('PUBLISH_STEP', step)
    },
    setUnfinishFlag ({ commit }, flag) {
      commit('SET_UNFINISH_FLAG', flag)
      storage.session.set('UNFINISH_FLAG', flag)
    },
    setUnfinishId ({ commit }, id) {
      commit('SET_UNFINISH_ID', id)
      storage.session.set('UNFINISH_ID', id)
    }
  }
}
export default app
