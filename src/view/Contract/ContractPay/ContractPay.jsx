import  Base  from '../../../base.js';
import { Flex, List, InputItem } from 'antd-mobile';
import './ContractPay.less'; 
class PayState extends React.Component {
  constructor(props,context){
    super(props, context);
    this.state = {}
  }
  componentWillMount(){  
  }
  render(){
     return (           
          <div className='pay-msg'>
            <div className='tit'>支付方式</div>
            <div className='align-betw'>合计金额:<span>12000</span></div>
            <div className='align-betw spec-color'>优惠1:<span>-1000</span></div>
            <div className='align-betw spec-color'>优惠2:<span>-500</span></div>
            <div className='align-betw spec-color'>优惠3:<span>-500</span></div>
            <div className='align-betw spec-color'>优惠总计:<span>2000</span></div>
            <div className='align-betw spec-color amount-pay'>实付金额:<span>2000</span></div>
          </div>
        )
    }
}
class FillPay extends React.Component {
  constructor(props,context){
    super(props, context);
    this.state = {}
  }
  componentWillMount(){  
  }
  render(){
     return (           
          <div className='fill-pay'>
            <List>
              <InputItem type='number'>现金</InputItem>
              <InputItem type='number'>POS机</InputItem>
              <InputItem type='number'>支付宝</InputItem>
              <InputItem type='number'>微信</InputItem>
              <InputItem type='number'>其他</InputItem>
            </List>
            <div className='check-pay'>支付金额比合同总金额少5元</div>
          </div>
        )
    }
}


class ContractPay extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {

    };
  }
  componentWillMount(){  
  }
  render(){
     return (           
          <div id="contract-pay" className=''>
            <PayState />
            <FillPay />
            <div className='btn-wrap'>
              <Flex>
                <Flex.Item><div className='modify-btn'>回到预览</div></Flex.Item>
                <Flex.Item><div className='pay-btn'>确认并提交</div></Flex.Item>
              </Flex>
            </div>
          </div>
        )
    }
  
}

module.exports = ContractPay;
