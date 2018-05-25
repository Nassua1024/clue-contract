
import { Flex, List, Button, ImagePicker } from 'antd-mobile';

import './ContractPreview.less'; 
import * as action from '../../../redux/action/action'

const { connect } = ReactRedux;
const { Link } = ReactRouterDOM;
const Item = List.Item;

const Http = Base;
const api = Base.url.Api; 

class ContractPreview extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            item:'',
            specialDiscountPrice:'',//打折金额
            originContractId:'', //升级前原合同Id 
            totalBonusHours:'',
        };
    }

    componentWillMount(){

        let { specialDiscountPrice } = this.state;
        let item = JSON.parse(this.props.view);

        let originContractId = item.originContractId;
        let totalBonusHours = item.reSignBonusHours + item.publicTransferHours + item.tttoBonusHours + item.newSignBonusHours + Number(item.HourGive) + item.activeDisHour;
        let totalHours = totalBonusHours + item.hourPackage;
        specialDiscountPrice = (item.externalPrice - item.totalPrice - item.discountPrice - item.activeDisPrice -item.recommendDiscountPrice).toFixed(2);

        this.setState({
            item,
            originContractId,
            totalBonusHours,
            totalHours,
            specialDiscountPrice
        });
    }

    commit(){

        let { item, totalBonusHours, specialDiscountPrice } = this.state;  
        let ListenResult = JSON.parse(localStorage.getItem('visitListenResult'));
        let contractCourseAllocations = [];
        let dataItem = {};

        item.contractCourseAllocations.map(item => {
            dataItem.lessonHour = item.lessonHour;
            dataItem.teacherId = item.teacherId;
            dataItem.courseId = item.courseId;
            contractCourseAllocations.push(Object.assign({}, dataItem));
        });

        let params = {
            method:'POST',
            data:{
                leadStudentId:item.stuId || '',
                signDate:item.signDate,
                studentName:item.studentName,
                birthDate:item.brithDay,
                gender:item.gender,
                gradeId:item.gradeId,
                hourPackageId:item.hourPackageId,
                activityId:item.activityId,
                totalPrice:item.totalPrice,
                cash:item.cash,
                pos:item.pos,
                aliPay:item.aliPay,
                wechatPay:item.wechatPay,
                otherPay:item.otherPay,
                newSignBonusHours:item.newSignBonusHours, 
                reSignBonusHours:item.reSignBonusHours, 
                tttoBonusHours:item.tttoBonusHours,
                publicTransferHours:item.publicTransferHours, 
                recommendDiscountPrice:item.recommendDiscountPrice,
                crossDiscountPrice: item.crossDiscountPrice,
                totalBonusHours,
                contractSpecialId:item.specialId,
                specialGiftHour:item.HourGive,           
                specialDiscountPrice:specialDiscountPrice,
                note:item.note,
                contractCourseAllocations
            }
        }

        /*续费*/
        if(item.isResign == true){

            params.data.originContractId = Number(this.state.originContractId);
            Http.ajax(`${api}/changgui/contracts/resign`,params).then(res => {
                if(res.code == 0){
                    this.props.linkTo(res.data.contractId);
                }
            });

        /*新建*/
        }else{

            params.data.leadId = item.leadId;
            params.data.isListen = ListenResult != null ? ListenResult.isListen : '';
            params.data.isVisit = ListenResult != null ? ListenResult.isVisit : '';
            params.data.result = ListenResult != null ? ListenResult.result : '';
            params.data.reason = ListenResult != null ? ListenResult.reason : '';

            if (item.originPublicContractId) {
                params.data.originPublicContractId = Number(item.originPublicContractId);
            }

            Http.ajax(`${api}/changgui/contracts/create`, params).then(res => {
                if(res.code == 0){
                    
                    /*口碑合同*/
                    if(res.data.recommend && res.data.giftRecommendHour > 0){
                        localStorage.setItem('praise',JSON.stringify({
                            list: res.data.referLeadContracts,
                            hour: res.data.giftRecommendHour
                        }));
                        this.props.praiseContract(res.data.contractId);

                    /*新建合同*/
                    }else{
                        this.props.linkTo(res.data.contractId);
                    }

                    localStorage.removeItem('visitListenResult');
                }
            });
        }
    }

    render(){

        const { item, totalBonusHours, totalHours, HourGive, monDis } = this.state;
        console.log(item)

        return(           
            <div id="contract-preview" className='base-css'>

                {/*合同信息*/}
                <div className='contract-header common-css'>
                    <div className='tit'>合同信息</div>
                    <ul>
                        <li><label>签订日期：</label><span>{ item.signDate }</span></li>
                        <li><label>签&nbsp;&nbsp;订&nbsp;&nbsp;人：</label><span>{ item.staffName }</span></li>
                    </ul>
                </div> 

                {/*学员信息*/}
                <div className='stu-msg common-css'>
                    <div className='tit'>学员信息</div>
                    <ul>
                        <li><label>学员姓名：</label><span>{ item.studentName }</span></li>
                        <li><label>学员性别：</label><span>{ item.sex }</span></li>
                        <li><label>出生日期：</label><span>{ item.brithDay }</span></li>
                        <li><label>年级：</label><span>{ item.gradeName }</span></li>
                    </ul>
                </div>

                {/*合同详情*/}
                <div className='contract-msg common-css'>
                    <div className='tit'>合同详情</div>
                    <ul>
                        <li><label>合同类别：</label><span>{ item.contractType }</span></li>
                        <li><label>合同有效期：</label><span>{ item.validMonth }个月</span></li>
                    </ul>
                    <div className="flex-wrap">
                        <Flex>
                            <Flex.Item>购买课时：</Flex.Item>
                            <Flex.Item>{ item.hourPackage }课时</Flex.Item>
                        </Flex>
                        {
                            item.newSignBonusHours > 0 &&
                            <Flex>
                                <Flex.Item>新签赠送：</Flex.Item>
                                <Flex.Item>{ item.newSignBonusHours }课时</Flex.Item>
                            </Flex>
                        }
                        {
                            item.reSignBonusHours > 0 &&
                            <Flex>
                                <Flex.Item>续费赠送：</Flex.Item>
                                <Flex.Item>{ item.reSignBonusHours }课时</Flex.Item>
                            </Flex>
                        }
                        {
                            item.publicTransferHours > 0 &&
                            <Flex>
                                <Flex.Item>公益课转化赠送：</Flex.Item>
                                <Flex.Item>{ item.publicTransferHours }课时</Flex.Item>
                            </Flex>
                        }
                        {
                            item.tttoBonusHours > 0 &&
                            <Flex>
                                <Flex.Item>3321赠送：</Flex.Item>
                                <Flex.Item>{ item.tttoBonusHours }课时</Flex.Item>
                            </Flex>
                        }
                        {
                            item.HourGive != 0 &&
                            <Flex className="special">
                                <Flex.Item>课时特批：</Flex.Item>
                                <Flex.Item>{ item.HourGive }课时</Flex.Item>
                            </Flex>
                        }
                        {   
                            item.activeDisHour != '' &&
                            <Flex>
                                <Flex.Item>{ item.activeName }优惠赠送：</Flex.Item>
                                <Flex.Item>{ item.activeDisHour }课时</Flex.Item>
                            </Flex>
                        }
                        <Flex>
                            <Flex.Item>总计课时：</Flex.Item>
                            <Flex.Item>{ totalHours }课时</Flex.Item>
                        </Flex>
                        <Flex>
                            <Flex.Item>总计金额：</Flex.Item>
                            <Flex.Item>{ item.externalPrice }元</Flex.Item>
                        </Flex>
                        {
                            item.discountPrice > 0 &&
                            <Flex>
                                <Flex.Item className="give">优惠：</Flex.Item>
                                <Flex.Item>{ -item.discountPrice }元</Flex.Item>
                            </Flex>
                        }
                        {   
                            item.activeDisPrice != '' &&
                            <Flex>
                                <Flex.Item className="give">{ item.activeName }优惠减免：</Flex.Item>
                                <Flex.Item>{ -item.activeDisPrice }元</Flex.Item>
                            </Flex>
                        }
                        {
                            item.recommendDiscountPrice > 0 &&
                            <Flex>
                                <Flex.Item className="give">口碑优惠：</Flex.Item>
                                <Flex.Item>{ -item.recommendDiscountPrice }元</Flex.Item>
                            </Flex>
                        }
                        {
                            item.crossDiscountPrice > 0 &&
                            <Flex>
                                <Flex.Item className="give">跨馆推荐优惠：</Flex.Item>
                                <Flex.Item>{ -item.crossDiscountPrice }元</Flex.Item>
                            </Flex>
                        }
                        {
                            item.specialMon != '' &&
                             <Flex>
                                <Flex.Item className="give">金额特批：</Flex.Item>
                                <Flex.Item>{ -item.specialMon + '元' }</Flex.Item>
                            </Flex>
                        }
                        {
                            item.monDis != 1 &&
                            <Flex>
                                <Flex.Item>金额特批：</Flex.Item>
                                <Flex.Item>{ item.monDis*10 + '折' }</Flex.Item>
                            </Flex>
                        }
                        <Flex>
                            <Flex.Item>实付金额：</Flex.Item>
                            <Flex.Item className="money"><strong>{ item.totalPrice }</strong><span>元</span></Flex.Item>
                        </Flex>
                    </div>
                </div>

                {/*课时规划*/}
                <div className="plan-hour common-css">
                    <div className='tit'>课时规划</div>
                    {
                        item.contractCourseAllocations.map((item, index) => (
                            <ul key={ index }>
                                <li><label>课时数：</label><span>{ item.lessonHour }</span></li>
                                <li><label>老师：</label><span>{ item.teacherName }</span></li>
                                <li><label>年级：</label><span>{ item.gradeName }</span></li>
                                <li><label>课程：</label><span>{ item.courseName }</span></li>
                            </ul>
                        ))   
                    }
                </div>

                {/*联系人信息*/}
                <div className='link-msg common-css'>
                    <div className='tit'>联系人信息</div>
                    <ul className="link">
                        <li className="stu-name">
                            <label>联系人：</label>
                            <span>{ item.linkName }</span>
                        </li>
                        <li>
                            <label>联系电话：</label>
                            <span className="link-tel">{ item.linkTel ? item.linkTel.replace(/(^\d{3}|\d{4}\B)/g,"$1-") : '' }</span>
                        </li>
                    </ul>
                    {
                        item.emergencyInfo != '' &&
                        <div className="relat">
                            <div className='tit'>紧急联系人：</div>
                            {
                                item.emergencyInfo.map((item,index) => {
                                    return(
                                        <Flex key={ index }>
                                            <Flex.Item>{ item.relation }</Flex.Item>
                                            <Flex.Item>{ item.name }</Flex.Item>
                                            <Flex.Item>{ item.mobile ? item.mobile.replace(/(^\d{3}|\d{4}\B)/g,"$1-") : '' }</Flex.Item>
                                        </Flex>
                                    );
                                })
                            }                            
                        </div>
                    }
                </div>

                {/*支付方式*/}
                <div className='pay-state common-css'>
                    <div className='tit'>支付</div>
                    <div className="flex-wrap">
                        {
                            item.cash > 0 &&
                            <Flex>
                                <Flex.Item className="cash">现金：</Flex.Item>
                                <Flex.Item>{ item.cash }元</Flex.Item>
                            </Flex>
                        }
                        {
                            item.pos > 0 &&
                            <Flex>
                                <Flex.Item className="pos">POS机：</Flex.Item>
                                <Flex.Item>{ item.pos }元</Flex.Item>
                            </Flex>
                        }
                        {
                            item.wechatPay > 0 &&
                            <Flex>
                                <Flex.Item className="wx">微信：</Flex.Item>
                                <Flex.Item>{ item.wechatPay }元</Flex.Item>
                            </Flex>
                        }
                        {
                            item.aliPay > 0 &&
                            <Flex>
                                <Flex.Item className="zfb">支付宝：</Flex.Item>
                                <Flex.Item>{ item.aliPay }元</Flex.Item>
                            </Flex>
                        }
                        {
                            item.otherPay > 0 &&
                            <Flex>
                                <Flex.Item className="other">其它：</Flex.Item>
                                <Flex.Item>{ item.otherPay }元</Flex.Item>
                            </Flex>
                        }
                        <Flex>
                            <Flex.Item>实付金额：</Flex.Item>
                            <Flex.Item className="money"><strong>{ item.totalPrice }</strong><span>元</span></Flex.Item>
                        </Flex>
                    </div>
                </div>

                <div className="more-operation">
                    <Button onClick={ () => this.props.modify() } >修改</Button>
                    <Button onClick={ () => this.commit() } >提交合同</Button>
                </div>
            </div>
        );
    }
}

export default ContractPreview;