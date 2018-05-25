
import './OperationList.less'; 

const { Link } = ReactRouterDOM;
const Http =Base;
const api = Base.url.Api;

class OperationList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isPublic: this.props.history.location.search == '?1' ? true : false,
            contractId: this.props.match.params.contractId, //合同Id
            leadId: this.props.match.params.leadId,
        };
    }

    componentWillMount(){
        this.operationList();
    }

    operationList (){
       
        const {contractId}= this.state;
        const params={
            method: 'post',
            formData: true,
            data: {
                contractId
            }
        };

        Http.ajax(`${api}/changgui/contracts/contract-operations`,params).then(res => {
            if(res.code == 0){
              
                const item = res.data.data;
              
                this.setState({
                    fendan: item.fendan,
                    shengji: item.shengji,
                    xufei: item.xufei,
                    xueyuan: item.xueyuan,
                    dongjie: item.dongjie,
                    zhuanrang: item.zhuanrang,
                    suodang: item.suodang,
                    tuifei: item.tuifei,
                    zuofei: item.zuofei,
                    zhuanhua: item.zhuanhua
                });
            }
        });
    }

    clickXuFei() {

        const { isPublic, leadId, stuId, contractId } = this.state;

        if(isPublic) {
            this.props.history.push(`/SelectStu/${contractId}/${leadId}?1`);
        } else {
            this.props.history.push(`/SelectStu/${contractId}/${leadId}`);
        }
    }

    render(){
        
        const { contractId, dongjie, fendan, xufei, xueyuan, shengji, suodang, tuifei,zhuanrang, zuofei, leadId, stuId, xufeiTxt, isPublic, zhuanhua } = this.state;
        
        return(
            <div id="operation-list">
                <ul>
                    <li>
                        {
                            fendan == true ? 
                            <Link className="can-use" to={`/Fendan/${contractId}`}>分单</Link> :
                            <a className="no-use" href='javascript:void(0)'>分单</a> 
                        }
                    </li>
                    <li>
                        {
                            shengji == true ? 
                            <Link className="can-use" to={`/UpContract/${contractId}`}>升级</Link> : 
                            <a className="no-use" href='javascript:void(0)'>升级</a> 
                        }
                    </li>
                    {
                        isPublic && 
                        <li>
                            {
                                zhuanhua == true ? 
                                <a className='can-use' href="javascript:void(0)" onClick={ () => this.clickXuFei() }>转化</a> : 
                                <a className="no-use" href='javascript:void(0)'>转化</a> 
                            }
                        </li>
                    }
                    {
                        !isPublic && 
                        <li>
                            {
                                xufei == true ? 
                                <a className='can-use' href="javascript:void(0)" onClick={ () => this.clickXuFei() }>续费</a> : 
                                <a className="no-use" href='javascript:void(0)'>续费</a> 
                            }
                        </li>
                    }
                    <li>
                        {
                            xueyuan == true ? 
                            <Link className="can-use" to={`/AddStu/${contractId}`}>添加学员</Link> : 
                            <a className="no-use" href='javascript:void(0)'>添加学员</a> 
                        }
                    </li>
                    <li>
                        {
                            dongjie == true ? <Link className="can-use" to={`/FreezeContract/${contractId}`}>申请冻结</Link> : 
                            <a className="no-use" href='javascript:void(0)'>申请冻结</a> 
                        }
                    </li>
                    <li>
                        {
                            zuofei == true ? <Link className="can-use" to={`/VoidApplication/${contractId}`}>申请作废</Link> : 
                            <a className="no-use" href='javascript:void(0)'>申请作废</a> 
                        }
                    </li>
                    {/* <li>{zhuanrang == true ? <Link className="can-use" to={`/ContractTransfer/${contractId}`}>合同转让</Link> : <a className="no-use" href='javascript:void(0)'>合同转让</a> }</li> */}
                    {/* <li>{suodang == true ? <Link className="can-use" to={`/SingleContract/${contractId}`}>缩单</Link>: <a className="no-use" href='javascript:void(0)'>缩单</a> }</li> */}
                    {/* <li>{tuifei == true ? <Link className="can-use" to={`/ApplyRefund/${contractId}`}>退费</Link>: <a className="no-use" href='javascript:void(0)'>退费</a> }</li> */}
                </ul>
            </div>  
        );
    }
}

module.exports = OperationList;