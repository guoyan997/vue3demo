import { createStore } from 'vuex'
import user from './modules/user'
export default createStore({
  state: {
    count: 0
  },
  actions: {
    add ({ commit, state }, params) {
      commit('updateCount', state.count + 1)
    },
    reduce ({ commit, state }, params) {
      commit('updateCount', state.count - 1)
    }
  },
  mutations: {
    updateCount (state, payload) {
      state.count = payload
    }
  },
  modules: {
    user
  }
})
