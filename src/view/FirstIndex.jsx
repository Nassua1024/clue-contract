import './FirstIndex.less';
import * as action from '../redux/action/action'

const { Link } = ReactRouterDOM;
const Http = Base;
const api = Base.url.Api;
const { connect } = ReactRedux

class FirstIndex extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            clueNum: '',
            contractNum: '',
            tyefangNum: ''
        }
    }

    componentWillMount() {
        this.props.clearReduxSearch()

        const params = {
            method: 'get',
            formData: true
        }
        Http.ajax(`${api}/lead/home-info`, params).then(res => {
            if (res.code === '0') {
                const {
                    leadCount: clueNum,
                    contractCount: contractNum,
                    appointmentCount: tyefangNum
                } = res.data.homeInfo

                this.setState({
                    clueNum,
                    contractNum,
                    tyefangNum
                })
            }
        });
    }

    linkTo(_el, index) {

    }

    render() {
        return (
            <div id="first-index">
                <Link to={`ClueList`}>
                    <div className="to-clue list">
                        <img src={require('../img/list1.png')} />
                        <span className='num1 num' style={{ display: !this.state.clueNum ? 'none' : 'block' }}>{this.state.clueNum}</span>
                    </div>
                </Link>
                <Link to={`Index`}>
                    <div className="to-contract list">
                        <img src={require('../img/list2.png')} />
                        <span className='num2 num' style={{ display: !this.state.contractNum ? 'none' : 'block' }}>{this.state.contractNum}</span>
                    </div>
                </Link>
                <Link to={`Home`}>
                    <div className="to-yuefang list">
                        <img src={require('../img/list3.png')} />
                        <span className='num3 num' style={{ display: !this.state.tyefangNum ? 'none' : 'block' }}>{this.state.tyefangNum}</span>
                    </div>
                </Link>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    state: state
})
const FirstIndexConnect = connect(
    mapStateToProps,
    action
)(FirstIndex)

module.exports = FirstIndexConnect;