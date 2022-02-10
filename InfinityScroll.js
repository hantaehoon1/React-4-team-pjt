import _ from 'lodash'
import React from 'react'
//4-4-1
import Spinner from '../elements/Spinner' //스피너
const InfinityScroll = (props) => {
    
    const {children, callNext, is_next, loading} = props
    
    const _handleScroll = _.throttle(() =>{
        
        if(loading){
            return
        }

        const {innerHeight} = window
        const {scrollHeignt} = document.body
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
        
        if(scrollHeignt - innerHeight -scrollTop <200){
            callNext()
        }
        }, 300)

    const handleScroll = React.useCallback(_handleScroll, [loading])

        
    React.useEffect(() => {
        
        if(loading){
            return
        }
        if(is_next){
            window.addEventListener('scroll', handleScroll)
        }else{
            window.addEventListener('scroll', handleScroll)
        }
    
        return window.removeEventListener('scroll', handleScroll)
    }, [is_next, loading])


    return (
        <React.Fragment>
            {props.children} {/* //4-4-1 */}
            {is_next && (<Spinner/>)} {/* //스피너 */}
        </React.Fragment>
    )
}
//4-4-3
InfinityScroll.defaultProps = {
    children: null,
    callNext : () => {},
    is_next : false,
    loading : false,
}
export default InfinityScroll