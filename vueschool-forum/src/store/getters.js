import {countObjectProperties} from '@/utils'

export default {
    authUser(state){
        return state.users[state.authId];
      },
  
      /** ARROW FUNCTION - same as this:
       *     userPostsCount(state){
              return function(id){
                return countObjectProperties(state.users[id].posts);
              }
            }
       */
      userThreadsCount: state => id => countObjectProperties(state.users[id].threads),
      userPostsCount: state => id => countObjectProperties(state.users[id].posts),
      threadRepliesCount: state => id => countObjectProperties(state.threads[id].posts) - 1
    
}