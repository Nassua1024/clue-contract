import {SearchBar} from 'antd-mobile'
import * as action from '../../../../redux/action/action'

const { connect } = ReactRedux
class search extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    handleCancel() {
        this.props.history.replace(localStorage.getItem('formRouter') || '/clueList')
    }

    handleChange(value) {

        this.setState({
            value
        })

        this.props.clueListSearchValue(value)
    }

    render() {
        const {value} = this.state
        return (
            <div>
                <SearchBar value={value} cancelText="搜索" onChange={this.handleChange.bind(this)} onCancel={this.handleCancel.bind(this)} />
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    searchValue: state.searchValue
})
const ClueListSearch = connect(
    mapStateToProps,
    action
)(search)

export default ClueListSearch;