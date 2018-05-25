import './addClue.less'
import {Toast} from 'antd-mobile'

const { Link } = ReactRouterDOM
class LinkNextStep extends React.Component {

    constructor(props) {
        super(props)

        this.handleLink = this.handleLink.bind(this)
    }

    handleLink  (e)  {
        const beforeClick = this.props.beforeClick && this.props.beforeClick()

        if (beforeClick === false) {
            e.preventDefault()
            return false;
        }

        const {linkEnabled, disabled} = this.props

        const ToastInfo = this.props.ToastInfo || '请先录入相关线索'

        if (!linkEnabled) {
            Toast.info(ToastInfo, 1.5, null, false)
            e.preventDefault()
            return ;
        }
        if (disabled) {
            e.preventDefault()
        }

        this.props.onClick && this.props.onClick()
    }

    render() {
        const {linkEnabled} = this.props
        const linkClass = linkEnabled ? '' : 'next-step-btn-disabled'

        return (
            <Link to={this.props.to} className={`next-step-btn btn-main-long ${linkClass}`} onClick={this.handleLink}>{this.props.children}</Link>
        )
    }

}

export default LinkNextStep;