
import { TextareaItem, List, Flex, Button, Picker,Toast,Modal, WhiteSpace, WingBlank,SearchBar } from 'antd-mobile';
import * as action from '../../../../redux/action/action';

import './SingleContract.less';

const alert=Modal.alert;
const { connect } = ReactRedux;

const Http=Base;
const { Api:URL }=Http.url;

class SingleContract extends React.Component {
	constructor(props){
		super(props);
		this.state={
			marginTop:'',
			classData:new Array(),
			inputVal:'' ,//缩单理由
			contractId:props.match.params.contractId,
			inputHour:'', //缩单课时
		};
	}

	componentWillMount(){

		const params = {
			data:{
				contractId:this.state.contractId
			}
		};

		Http.ajax(`${URL}/changgui/selections/contract-cut-packages`,params).then(res => {
			if(res.code == 0){
			   	this.setState({
			   		classData:res.data.hourPackages
			   	}, this.reMarginTop);

            }
		});
	}

	componentDidMount(){

	}

	reMarginTop() {
        let { marginTop } = this.state;
        marginTop = document.body.clientHeight - document.getElementById('cont').offsetHeight - 186;
        this.setState({
            marginTop
        });
    }

	alertok(){

		const { contractId } = this.state;

		alert('', '缩单成功', [
	        {
	           text: '查看详情', onPress: () => this.props.history.push(`/ContractDetail/${contractId}`)
	        },
	        {
	           text: '返回列表',onPress: () => this.props.history.push(`/NormalList/all`)
	        },
	    ]);
	}

	commit(){

		const { inputVal, inputHour,contractId, } = this.state;

		if(inputHour === ''){
			Toast.info('请选择缩单课时',1);
			return false;
		}

		if(inputVal === ''){
			Toast.info('请填写缩单理由',1);
			return false;
		}

		if(contractId==null){
            Toast.info('无效合同',1);
            return false;
        }

		const params={
			method:'post',
			formData:true,
			data:{
				contractId:contractId,
				contractHourPackageId:inputHour,
				reason:inputVal,
			}
		};

		Http.ajax(`${URL}/contracts/cut-contract`,params).then((res)=>{
			if(res.code == 0){
			    this.alertok()
			}
		});
	}

	packageHour(v){
		this.setState({
			inputHour:v
		});
	}

	render(){

		const { classData, inputHour, marginTop } = this.state;

		return(
			<div className="single-contract base-css">
				<div id="cont">
					<div className="title"><i></i><h3>缩单申请</h3></div>
					<p className="type">缩单课时</p>
					<Flex className="up-grade">
	                    {
	                        classData.map((item,index) => {
	                        	const active = inputHour === item.id ? 'active' :'';
	                            return (
	                                <div onClick={ () => this.packageHour(item.id) } className={ active } key={ index }>{ item.hour }</div>
	                            )
	                        })
	                    }
	                </Flex>
				    <List>
						<TextareaItem
				            placeholder="请输入特批理由"
				            data-seed="logId"
				            autoFocus
				            autoHeight
				            onChange={ (e) => this.setState({ inputVal:e }) }
				        />
			        </List>
				</div>
		        <Button onClick={() => this.commit() } style={{ marginTop:marginTop }}>提交缩单</Button>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
    ConcernLabels: state.ConcernLabels
})

const SINGleContract = connect(
    mapStateToProps,
    action
)(SingleContract)

export default SINGleContract;