import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'
import app from './modules/app'
import permission from './modules/permission'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    app,
    permission
  },
  actions,
  getters,
  state,
  mutations,
  // strict: debug,
  plugins: debug ? [createLogger()] : []
})
