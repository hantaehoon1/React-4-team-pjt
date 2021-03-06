// PostList.js
import React from "react";
import {useSelector, useDispatch} from "react-redux";

import Post from "../components/Post";
import post, {actionCreators as postActions} from "../redux/modules/post";
import InfinityScroll from "../shared/InfinityScroll";

const PostList = (props) => {
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user);//3-12-1-수정
    const is_loading = useSelector((state) => state.post.is_loading) //4-2-11
    const paging = useSelector((state) => state.post.paging) //4-2-11

    React.useEffect(() => {

        if(post_list.length === 0){
             dispatch(postActions.getPostFB());
        }
       
    }, []);
    
    //3-12-2-수정
    return (
        <React.Fragment> 
            {/* <Post/> */}
            {/* <InfinityScroll
            callNext={()=> {
                dispatch(postActions.getPostFB(paging.next))
                console.log('next!')
            }}
            is_next={paging.next? true:false}
            loading={is_loading} // loading이 false를 의미
            > 4-4-2 */}
                
            {post_list.map((p, idx) => {
                if(p.user_info.user_id === user_info?.uid){
                    return <Post key={p.id} {...p} is_me/>;    
                }else{
                    return <Post key={p.id} {...p} />;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                }        
            })}
            {/* </InfinityScroll> */}

            <button onClick={()=>{
                     dispatch(postActions.getPostFB(paging.next))
                 }}>추가로드</button>
        </React.Fragment>
    )
}

export default PostList;

