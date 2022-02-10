import React from "react";
import { Grid, Image, Text, Button } from "../elements"; //3-12-3-수정

import {history} from "../redux/configureStore"; //3-12-6-수정

 const Post = (props) => {
  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            <Text>{props.insert_dt}</Text>
            {props.is_me && (
              <Button width="auto" margin="4px" padding="4px" _onClick={() => {
                history.push(`/write/${props.id}`); //3-12-4-수정
              }}>
                수정
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid padding="16px">
          <Text>{props.contents}</Text>
        </Grid>
        <Grid>
          <Image shape="rectangle" src={props.image_url} />
        </Grid>
        <Grid padding="16px">
          <Text margin="0px" bold>
            댓글 {props.comment_cnt}개
          </Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
  user_info: {
    user_name: "TT",
    user_profile: "https://post-phinf.pstatic.net/MjAyMDA3MDhfMjc1/MDAxNTk0MTczMjk3NTgx.HESbIHOx_nRR3cT1T29So3kiJ1CmYoZuI49Z9lF7Oj4g.JagQP2wpFGiKi5PyJOmMgbZo_nu-gg3oHV6Q3Nv5B34g.JPEG/%EC%97%B0%EA%B3%A1%EC%86%94%ED%96%A5%EA%B8%B0%EC%BA%A0%ED%95%91%EC%9E%A5_1.jpg?type=w1200",
  },
  image_url: "https://post-phinf.pstatic.net/MjAyMDA3MDhfMjc1/MDAxNTk0MTczMjk3NTgx.HESbIHOx_nRR3cT1T29So3kiJ1CmYoZuI49Z9lF7Oj4g.JagQP2wpFGiKi5PyJOmMgbZo_nu-gg3oHV6Q3Nv5B34g.JPEG/%EC%97%B0%EA%B3%A1%EC%86%94%ED%96%A5%EA%B8%B0%EC%BA%A0%ED%95%91%EC%9E%A5_1.jpg?type=w1200",
  contents: "캠핑!",
  comment_cnt: 10,
  insert_dt: "2021-02-27 10:00:00",
  is_me: false, //3-12-5-수정
};

export default Post;
