import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import "moment";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST"; //3-12-17-수정
const LOADING = 'LOADING' //4-2-3 is_loading :true로 바꾸는 액션

const setPost = createAction(SET_POST, (post_list, paging) => ({ post_list, paging }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
})); //3-12-18-수정
const loading = createAction(LOADING, (is_loading) => ({is_loading})) //4-2-4

const initialState = {
  list: [],
  paging: {start:null, next: null, size:3 },//4-2-1
  is_loading : false, //4-2-2
};

const initialPost = {
  // id: 0,
  // user_info: {
  //   user_name: "mean0",
  //   user_profile: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  // },
  image_url: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  contents: "",
  comment_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};
//3-12-22-수정
const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }

    const _image = getState().image.preview;

    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];

    console.log(_post);

    const postDB = firestore.collection("post");

    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          history.replace("/");
        });
     //
     //3-12-23-수정
      return;
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      _upload.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);

            return url;
          })
          .then((url) => {
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                dispatch(editPost(post_id, { ...post, image_url: url }));
                history.replace("/");
              });
          })
          .catch((err) => {
            window.alert("앗! 이미지 업로드에 문제가 있어요!");
            console.log("앗! 이미지 업로드에 문제가 있어요!", err);
          });
      });
    }
  };
};
        //
const addPostFB = (contents = "") => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");

    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    const _post = {
      ...initialPost,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    const _image = getState().image.preview;

    console.log(_image);
    console.log(typeof _image);

    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);

          return url;
        })
        .then((url) => {
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              dispatch(addPost(post));
              history.replace("/");

              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("앗! 포스트 작성에 문제가 있어요!");
              console.log("post 작성에 실패했어요!", err);
            });
        })
        .catch((err) => {
          window.alert("앗! 이미지 업로드에 문제가 있어요!");
          console.log("앗! 이미지 업로드에 문제가 있어요!", err);
        });
    });
  };
};
//4-2-5 첫번째로 가져오는거면 start : null, 
const getPostFB = (start = null, size=3) => {
  return function (dispatch, getState, { history }) {
    
    // let _paging = getState().post.paging
    // if(_paging.start && !_paging.next){
    //   return //4-2-11 다음페에지 없을경우 끝
    // }
    // dispatch(loading(true)) //4-2-5

    const postDB = firestore.collection("post");

    // let query = postDB.orderBy("insert_dt", "desc") //4-2-6

    // if(start) {
    //   query=query.startAt(start) //4-2-6 어디에서부터 가져오라고 하면 조건 붙여줘야한다
    // }
    // // size+1 하는이유는 다음페이지를 확인하려고
    // query.limit(size+1).get().then((docs) => { //4-2-7
    //   let post_list = [];
    //   //paging 정보 4-2-8
    //   let paging = {
    //     start:docs.docs[0],
    //     next: docs.docs.length === size+1? docs.docs[docs.docs.length -1] : null,
    //     size: size,
    //   }
    //   docs.forEach((doc) => {
    //     let _post = doc.data();

    //     // ['commenct_cnt', 'contents', ..]
    //     let post = Object.keys(_post).reduce(
    //       (acc, cur) => {
    //         if (cur.indexOf("user_") !== -1) { //?
    //           return {
    //             ...acc,
    //             user_info: { ...acc.user_info, [cur]: _post[cur] },
    //           };
    //         }
    //         return { ...acc, [cur]: _post[cur] };
    //       },
    //       { id: doc.id, user_info: {} }
    //     );

    //     post_list.push(post);
    //     post_list.pop() //4-2-9 3개만 보여줄 것이므로 마지막꺼 뺸다
    //   });

    //   console.log(post_list);

    //   dispatch(setPost(post_list , paging)); //4-2-9

    // })
    // return
    postDB.get().then((docs) => {
      let post_list = [];
      docs.forEach((doc) => {
        let _post = doc.data();

        // ['commenct_cnt', 'contents', ..]
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            if (cur.indexOf("user_") !== -1) { //?
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );

        post_list.push(post);
      });

      console.log(post_list);

      dispatch(setPost(post_list));
    });
  };
};

export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        //draft.list = action.payload.post_list; 리스트를 post_list로 갈아끼우는 것
        draft.list.push(...action.payload.post_list)
        draft.paging = action.payload.paging
        draft.is_loading =false
      }), //4-2-10

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }), //3-12-20-수정
      [LOADING]: (state, action) => produce(state, (draft) =>{
        draft.is_loading= action.payload.is_loading //4-2-5
      })
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  editPost, //3-12-19-수정
  getPostFB,
  addPostFB,
  editPostFB, //3-12-21-수정
};

export { actionCreators };
