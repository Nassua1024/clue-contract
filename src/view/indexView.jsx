import 'whatwg-fetch';
// import initReactFastclick from 'react-fastclick';
// initReactFastclick();
import fastClick from 'fastclick'
fastClick.attach(document.body)

const Http = Base

class IndexView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        // console.log('页面跳转')
        //判断环境
        const hostNames = [
            '',
            'localhost',
            '127.0.0.1',
            '192.168.1.189',
        ]
        if (hostNames.indexOf(window.location.hostname) < 0) {
            Http.resolveKeepOut();
            Http.getCookie(window.location.href)
        }
    	if (this.props.location.pathname=='/') {
            this.props.history.push(`FirstIndex`)
        }

        // if(Http.isPC()) {
        //     if(!window.location.href.match('pc-static')) {
        //         window.open(Http.url.Api+'/changgui-static/index.html#'+window.location.href.split('#')[1],'_self')
        //     }
        // }
    }
    render() {
        return (
        	<div></div>
        )
    }
}

export default IndexView;

