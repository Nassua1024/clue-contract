
import { Button } from 'antd-mobile';

import './UpContractCommit.less'; 

class UpContractCommit extends React.Component {

    componentWillMount(){
        this.setState({
            item:JSON.parse(localStorage.getItem('up'))
        });
    }

    render(){
        const { item } = this.state;
        console.log(item)
        return (           
            <div id="up-contract-commit" className='base-css success-base'>
                <header>升级成功</header>                
                <div className='old-wrap'>
                    <div className='title'><i></i><h3>原合同（已作废）</h3></div>
                    <div className="old-info" onClick={ ()=>this.props.history.push(`/ContractDetail/${item.oldContract.contractId}`) }>
                        <div className="name">{ item.oldContract.studentName }</div>
                        <ul>
                            <li><label>价格</label><span>{ item.oldContract.money }元</span></li>
                            <li><label>课时</label><span>{ item.oldContract.hour }</span></li>
                        </ul>
                    </div>
                </div>
                <div className='fresh-wrap'>
                    <div className='title'><i></i><h3>新合同</h3></div>
                    <div className="new-info" onClick={ ()=>this.props.history.push(`/ContractDetail/${item.upgradedContract.contractId}`) }>
                        <div className="name">{ item.oldContract.studentName }</div>
                        <ul>
                            <li><label>价格</label><span>{ item.upgradedContract.money }元</span></li>
                            <li><label>课时</label><span>{ item.upgradedContract.hour }</span></li>
                        </ul>
                    </div>
                </div>
                <Button className="btn-css" onClick={() => this.props.history.push(`/Index`)} >返回首页</Button>
            </div>
        )
    }
}

module.exports = UpContractCommit;