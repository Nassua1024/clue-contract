
import { Flex, List, Button, ImagePicker } from 'antd-mobile';

import './ContractDetail.less';

const { Link } = ReactRouterDOM;
const Item = List.Item;

const Http =Base;
const api = Base.url.Api;

class ContractDetail extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            detailType:'',
            contractId:this.props.match.params.contractId, // 合同Id
            arrangedHours:0, //有无排课
            contractDetail:new Array(),
            stuArray:new Array(),
            contractShares:new Array(), //分单方式
            relatedContracts:new Array(), //关联合同
            linkMan:new Array(), //紧急联系人列表
            contactPhone:'',
            ccFenDan:false,
            branchFenDan:false,
            applyType:'',
            applyContent:'',
            courseAllocations: []
        };
    }

    componentWillMount(){
        this.contractDetail();
    }

    /*合同详情*/
    contractDetail(){

        let { ccFenDan, branchFenDan } = this.state;

        const params = {
            data:{
               contractId:this.state.contractId
            }
        };

        Http.ajax(`${api}/changgui/contracts/detail`,params).then(res => {
            if(res && res.code == 0){

                for(var i=0; i<res.data.contractShares.length; i++){
                    if(res.data.contractShares[i].staffId != null) ccFenDan = true;
                    else branchFenDan = true;
                }
                    
                this.setState({
                    detailType:res.data.contractDetail.deleted,
                    contractDetail:res.data.contractDetail,
                    contractShares:res.data.contractShares,
                    relatedContracts:res.data.relatedContracts,
                    linkMan:res.data.contractDetail.emergentContacts,
                    arrangedHours:res.data.contractDetail.arrangedHours,
                    stuArray:res.data.contractDetail.students,
                    contactPhone:res.data.contractDetail.contactPhone,
                    ccFenDan,
                    branchFenDan,
                    specialId:res.data.contractDetail.specialId,
                    courseAllocations: res.data.courseAllocations
                });

                if(Number(res.data.contractDetail.specialId) > 0) this.getSpecialId(res.data.contractDetail.specialId);
            }
        });
    }

    /*获取特批信息*/
    getSpecialId(v) {

        let { applyType, applyContent, applyText } = this.state;

        const param = {
            data: {
                specialId: v,
            }    
        };

        Http.ajax(`${api}/changgui/get-special`,param).then((res) => {
            if(res.code == 0) {

                const data = res.data.contractSpecial;

                switch(data.specialType) {
                    case 'DISCOUNT_SPECIAL': 
                        applyType = '金额特批';
                        applyContent = data.specialDiscount/10 + '折';
                        break;

                    case 'HOUR_SPECIAL':
                        applyType = '课时特批';
                        applyContent = data.specialGiftHour + '课时';
                        break;

                    case 'OTHER_SPECIAL':
                        applyType = '其它特批';
                        applyContent = data.specialGiftHour + '课时';
                        break;
                }

                this.setState({
                    applyType,
                    applyContent
                });
            }
        });
    }

    /*关联合同*/
    relatedContracts(v){
        this.setState({
            contractId:v,
        },() => this.contractDetail() );
    }

    /*特批详情*/
    goSpecial() {
        const { specialId, contractDetail } = this.state;
        this.props.history.push(`/specialDetail/${specialId}#${contractDetail.id}`);
    }

    /*更多操作*/
    moreOperation() {

        const { contractId, contractDetail } = this.state;
        if(contractDetail.contractCategory == 'PUBLIC') {
            this.props.history.push(`/OperationList/${contractId}/${contractDetail.leadId}?1`);
        }else{
            this.props.history.push(`/OperationList/${contractId}/${contractDetail.leadId}`);
        }
    }

    render(){

        let { contactPhone, contractId, detailType, contractDetail, linkMan, arrangedHours, specialId,
            contractShares, relatedContracts, stuArray, ccFenDan, branchFenDan, applyType, applyContent, courseAllocations } = this.state;

        return( 
            <div id="contract-detail" className='base-css'>

                {/*合同信息*/}
                <div className='contract-header common-css'>
                    <div className='tit'>合同信息</div>
                    <ul>
                        <li><label>合同单号：</label><span>{ contractDetail.code }</span></li>
                        {
                            contractDetail.contractNo && 
                            <li><label>纸质合同：</label><span>{ contractDetail.contractNo }</span></li>
                        }
                        <li><label>签订日期：</label><span>{ contractDetail.contractDate==undefined?'': new Date(contractDetail.contractDate).Format('yyyy-MM-dd') }</span></li>
                        {
                            (contractDetail.startDate || contractDetail.endDate) && 
                            <li><label>有效期：</label><span>{ new Date(contractDetail.startDate).Format('yyyy-MM-dd') } - { new Date(contractDetail.endDate).Format('yyyy-MM-dd') }</span></li>
                        }
                        <li><label>签订人：</label><span>{ contractDetail.ccName }</span></li>
                        {
                            contractDetail.ownerName &&
                            <li><label>所属人：</label><span>{ contractDetail.ownerName }</span></li>
                        }
                    </ul>
                </div>

                {/*学员信息*/}
                <div className='stu-msg common-css'>
                    <div className='tit'>学员信息</div>
                    <div className="msg">
                        {
                            stuArray.map((item,index) => (
                                <ul key={ index }>
                                    <li className="stu-name">
                                        <label>学员姓名：</label>
                                        <span onClick={ () => this.props.history.push(`/clueDetail/${contractDetail.leadId}`) }>{ item.studentName }</span>
                                    </li>
                                    <li>
                                        <label>学员性别：</label>
                                        <span>{ item.genderName }</span>
                                    </li>
                                    <li>
                                        <label>出生日期：</label>
                                        <span>{ item.birthDay == null ? '--' : new Date(item.birthDay).Format('yyyy-MM-dd') }</span>
                                    </li>
                                    <li className="grade">
                                        <label>年级：</label>
                                        <span>{ item.gradeName }</span>
                                    </li>
                                </ul>
                            ))
                        }
                        <div className="paike">
                            <label>已上课时：</label>
                            <span>{contractDetail.totalHours==undefined ? '':contractDetail.totalHours - contractDetail.restHour }课时</span>
                            {   
                                !detailType &&
                                <Link to={'/ArrayCourse/'+contractDetail.id}> { (contractDetail.totalHours-contractDetail.arrangedHours) > 0 ? '去排课':'查看排课' }</Link>
                            }
                        </div>
                    </div>
                </div>

                {/*合同详情*/}
                <div className='contract-msg common-css'>
                    <div className='tit'>合同详情</div>
                    <ul>
                        <li>
                            <label>合同类别：</label>
                            <span>{ contractDetail.contractType }</span>
                        </li>
                        <li>
                            <label className="valid-month">合同有效期：</label>
                            <span>{ contractDetail.validMonth > 0 ? contractDetail.validMonth + '个月' : '--' }</span>
                        </li>
                    </ul>
                    <div className="flex-wrap">
                        <Flex>
                            <Flex.Item>购买课时：</Flex.Item>
                            <Flex.Item>{ contractDetail.hours }课时</Flex.Item>
                        </Flex>
                        {
                            contractDetail.newSignBonusHours > 0 &&
                            <Flex>
                                <Flex.Item>新签赠送：</Flex.Item>
                                <Flex.Item>{ contractDetail.newSignBonusHours }课时</Flex.Item>
                            </Flex>
                        }
                        {
                            contractDetail.reSignBonusHours > 0 &&
                            <Flex>
                                <Flex.Item>续费赠送：</Flex.Item>
                                <Flex.Item>{ contractDetail.reSignBonusHours }课时</Flex.Item>
                            </Flex>
                        }
                        {
                            contractDetail.publicTransferHours > 0 &&
                            <Flex>
                                <Flex.Item>公益课转化赠送：</Flex.Item>
                                <Flex.Item>{ contractDetail.publicTransferHours }课时</Flex.Item>
                            </Flex>
                        }
                        {
                            contractDetail.tttoBonusHours > 0 &&
                            <Flex>
                                <Flex.Item>3321赠送：</Flex.Item>
                                <Flex.Item>{ contractDetail.tttoBonusHours }课时</Flex.Item>
                            </Flex>
                        }

                        {/*其它特批下的课时特批*/}
                        {   
                            applyType == '其它特批' &&
                            <Flex className="special" onClick={ () => this.goSpecial() }>
                                <Flex.Item>课时特批：</Flex.Item>
                                <Flex.Item>{ contractDetail.specialGiftHour + '课时' }</Flex.Item>
                            </Flex>
                        }

                        <Flex onClick={ () => this.goSpecial() }>
                            <Flex.Item>总计赠送：</Flex.Item>
                            <Flex.Item>{ contractDetail.totalHours - contractDetail.hours + '课时' }</Flex.Item>
                        </Flex>
                        
                        {
                            applyType == '课时特批' &&
                            <Flex className="special" onClick={ () => this.goSpecial() }>
                                <Flex.Item>{ applyType }</Flex.Item>
                                <Flex.Item>{ applyContent }</Flex.Item>
                            </Flex>
                        }

                        <Flex>
                            <Flex.Item>总计课时：</Flex.Item>
                            <Flex.Item>{ contractDetail.totalHours }课时</Flex.Item>
                        </Flex>
                       
                        <Flex>
                            <Flex.Item>总计金额：</Flex.Item>
                            <Flex.Item>{ contractDetail.totalPrice }元</Flex.Item>
                        </Flex>
                        {
                            contractDetail.activityDiscountPrice > 0 &&
                            <Flex>
                                <Flex.Item className="give">活动优惠：</Flex.Item>
                                <Flex.Item>{ -Math.round(contractDetail.activityDiscountPrice) }元</Flex.Item>
                            </Flex>
                        }
                        {
                            contractDetail.crossDiscountPrice > 0 &&
                            <Flex>
                                <Flex.Item className="give">跨馆推荐优惠：</Flex.Item>
                                <Flex.Item>{ -contractDetail.crossDiscountPrice }元</Flex.Item>
                            </Flex>
                        }
                        {
                            contractDetail.recommendDiscountPrice > 0 &&
                            <Flex>
                                <Flex.Item className="give">口碑优惠：</Flex.Item>
                                <Flex.Item>{ -contractDetail.recommendDiscountPrice }元</Flex.Item>
                            </Flex>
                        }
                        {   
                            applyType == '其它特批' &&
                            <Flex className="special" onClick={ () => this.goSpecial() }>
                                <Flex.Item className="give">金额特批：</Flex.Item>
                                <Flex.Item>{ -Math.round(contractDetail.specialDiscountPrice) + '元' }</Flex.Item>
                            </Flex>
                        }
                        {
                            applyType == '金额特批' &&
                            <Flex className="special" onClick={ () => this.goSpecial() }>
                                <Flex.Item className="give">{ applyType }</Flex.Item>
                                <Flex.Item>{ applyContent }</Flex.Item>
                            </Flex>
                        }
                        <Flex>
                            <Flex.Item>实付金额：</Flex.Item>
                            <Flex.Item className="money">{ contractDetail.actualPrice }元</Flex.Item>
                        </Flex>
                    </div>
                    {
                        contractDetail.note != '' &&
                        <div className="note">
                            <label>合同备注：</label>
                            <p>{ contractDetail.note }</p>
                        </div>
                    }
                </div>

                {/*课时规划*/}
                <div className="plan-hour common-css">
                    <div className='tit'>课时规划</div>
                    {
                        courseAllocations.map((item, index) => (
                            <ul key={ index }>
                                <li><label>课时数：</label><span>{ item.lessonHour }</span></li>
                                <li><label>老师：</label><span>{ item.teacher }</span></li>
                                <li><label>年级：</label><span>{ item.grade }</span></li>
                                <li><label>课程：</label><span>{ item.course }</span></li>
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
                            <span onClick={ () => this.props.history.push(`/clueDetail/${contractDetail.leadId}`)} >{ contractDetail.contactName }</span>
                        </li>
                        <li>
                            <label>联系电话：</label>
                            {
                                contactPhone != null &&
                                <span className="link-tel">{ contactPhone.replace(/(^\d{3}|\d{4}\B)/g,"$1-") }</span>
                            }
                            
                        </li>
                    </ul>
                    {
                        linkMan != '' &&
                        <div className='mer'>紧急联系人：</div>
                    }
                    {
                        linkMan != '' &&
                        <div className="relat">
                            {
                                linkMan.map((item,index) => (
                                    <Flex key={ index} >
                                        <Flex.Item>{ item.relation }</Flex.Item>
                                        <Flex.Item>{ item.name }</Flex.Item>
                                        {
                                            item.mobile != null &&
                                            <Flex.Item>{ item.mobile.replace(/(^\d{3}|\d{4}\B)/g,"$1-") }</Flex.Item>
                                        }
                                    </Flex>
                                ))
                            }
                        </div>
                    }
                </div>

                {/*支付方式*/}
                <div className='pay-state common-css'>
                    <div className='tit'>支付方式</div>
                    <div className="flex-wrap">
                        {
                            contractDetail.cashPayPrice > 0 &&
                            <Flex>
                                <Flex.Item className="cash">现金：</Flex.Item>
                                <Flex.Item>{ contractDetail.cashPayPrice }元</Flex.Item>
                            </Flex>
                        }
                        {
                            contractDetail.posPayPrice > 0 &&
                            <Flex>
                                <Flex.Item className="pos">POS机：</Flex.Item>
                                <Flex.Item>{ contractDetail.posPayPrice }元</Flex.Item>
                            </Flex>
                        }
                        {
                            contractDetail.wechatPayPrice > 0 &&
                            <Flex>
                                <Flex.Item className="wx">微信：</Flex.Item>
                                <Flex.Item>{ contractDetail.wechatPayPrice }元</Flex.Item>
                            </Flex>
                        }
                        {
                            contractDetail.aliPayPrice > 0 &&
                            <Flex>
                                <Flex.Item className="zfb">支付宝：</Flex.Item>
                                <Flex.Item>{ contractDetail.aliPayPrice }元</Flex.Item>
                            </Flex>
                        }
                        {
                            contractDetail.otherPayPrice > 0 &&
                            <Flex>
                                <Flex.Item className="other">其它：</Flex.Item>
                                <Flex.Item>{ contractDetail.otherPayPrice }元</Flex.Item>
                            </Flex>
                        }
                        <Flex>
                            <Flex.Item>实际支付：</Flex.Item>
                            <Flex.Item className="money">{ contractDetail.actualPrice }元</Flex.Item>
                        </Flex>
                    </div>
                </div>

                {/*分单方式*/}
                {
                    contractShares.length > 0 &&
                    <div className='pay-part common-css'>
                        <div className='tit'>分单方式</div>
                        {
                            ccFenDan && 
                            <div className='tit cc-branch'>CC业绩分单</div>
                        }
                        <div className="fendan-list">
                        {
                            contractShares.map((item,index) => (
                                item.staffId != null &&
                                <ul key={ index } >
                                    <li className="time">创建于 { item.createTime }</li>
                                    <li><label>{ item.ccName }</label><span>{ item.score }元</span></li>
                                </ul>
                            ))
                        }
                        </div>
                        {
                            branchFenDan && 
                            <div className='tit store-branch'>分馆业绩分单</div>
                        }
                        <div className="fendan-list">
                        {
                            contractShares.map((item,index) => (
                                item.staffId == null &&
                                <ul  key={ index }>
                                    <li className="time">创建于 { item.createTime }</li>
                                    <li><label>{ item.storeName }</label><span>{ item.score }元</span></li>
                                </ul>
                            ))
                        }
                        </div>
                    </div>
                }
                
                {/*关联合同*/}
                {   
                    relatedContracts.length > 0 &&
                    <div className='contact-contract common-css'>
                        <div className='tit'>关联合同</div>
                        <div className="contract-list">
                            {
                                relatedContracts.map((item,index) => (
                                    <ul key={ index } onClick={ () => this.relatedContracts(item.id,item.contractType) }>
                                        <li>{ item.studentName }</li>
                                        {
                                            item.mobile != null &&
                                            <li>{ item.mobile.replace(/\s/g, '') }</li>
                                        }
                                        <li>{ item.contractType }</li>
                                    </ul>
                                ))
                            }
                        </div>
                    </div>
                }
                {
                    !detailType &&
                    <div className="more-operation">
                        <Button className='more-oprera' onClick={ () => this.moreOperation() }>更多操作</Button>
                    </div>
                }
            </div>
        );
    }
}

export default ContractDetail;