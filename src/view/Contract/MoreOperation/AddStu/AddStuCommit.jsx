
import { Button } from 'antd-mobile';

import './AddStuCommit.less'; 

class UpContractCommit extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            oldLesson:'作文课',
            oldClassHour:'160',
            oldPrice:'12800',
            newLesson:'书法课',
            newClassHour:'240',
            newPrice:'24800'
        }
    }

    render(){
        const { oldLesson, oldClassHour, oldPrice, newLesson, newClassHour, newPrice } = this.state;       
        return (           
            <div id="add-stu-commit" className='base-css success-base'>
                <header>添加学员成功</header>                
                <div className='old-wrap'>
                    <div className='title'><i></i><h3>原合同（已作废）</h3></div>
                    <div className="old-info">
                        <div className="name">胖婶</div>
                        <ul>
                            <li><label>课程</label><span>{ oldLesson }</span></li>
                            <li><label>课时</label><span>{ oldClassHour }</span></li>
                            <li><label>价格</label><span>{ oldPrice }</span></li>
                        </ul>
                    </div>
                </div>
                <div className='fresh-wrap'>
                    <div className='title'><i></i><h3>新合同</h3></div>
                    <div className="new-info">
                        <div className="name">胖婶</div>
                        <ul>
                            <li><label>课程</label><span>{ oldLesson }</span></li>
                            <li><label>课时</label><span>{ oldClassHour }</span></li>
                            <li><label>价格</label><span>{ oldPrice }</span></li>
                        </ul>
                    </div>
                    <div className="new-info">
                        <div className="name">胖婶</div>
                        <ul>
                            <li><label>课程</label><span>{ oldLesson }</span></li>
                            <li><label>课时</label><span>{ oldClassHour }</span></li>
                            <li><label>价格</label><span>{ oldPrice }</span></li>
                        </ul>
                    </div>
                </div>
                <Button className="btn-css" onClick={() => this.props.history.push(`/Index`)} >返回合同列表</Button>
            </div>
        )
    }
}

module.exports = UpContractCommit;