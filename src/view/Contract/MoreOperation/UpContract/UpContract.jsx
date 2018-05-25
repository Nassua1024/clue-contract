
import { Button, List, InputItem, Flex, Toast, DatePicker, Modal, Picker, TextareaItem } from 'antd-mobile';
import UpPlanHour from '../../PlanHour/UpPlanHour';
import './UpContract.less';

const { Link } = ReactRouterDOM;
const alert = Modal.alert;
const Http = Base;
const api = Base.url.Api;

class UpContract extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            leadId: '',
            gradeId: '',
            operatorName: '',
            signDate: new Date().Format('yyyy-MM-dd'), // 默认签订日期
            dpValue: '', // 选择签订日期
            contractDetail: new Object(), // 原合同信息
            studentName: '', // 学员姓名
            
            classData: new Array(), // 课时列表
            totalHours: '', // 原课时总数
            actualPrice: '', // 原课时数实际支付价格
            recommendDiscountPrice: 0, // 口碑推荐优惠
            totalPrice: '', // 原课时总价
            restHour: '',// 原合同剩余课时
            packageId: '', // 选择课时数对应的id
            upContactState: false, // 升级后合同详情显示状态
            upHour: '', // 升级课时
            upTotalHour: '', // 升级后总课时
            calcUpTotalHour: '',
            upRestHour: '', // 升级后剩余课时
            upRestTotalHour: '', //升级后剩余总课时, 
            calcUpRestTotalHour: '',
            upTotalPrice: '', // 升级后总价
            diffPrice: '', // 升级后需补差价
            calcPrice: '',

            showMask: false,
            showMaskTit: '',
            giftHourArr: new Array(),
            giftType: '',
            giftHour: 0, // 选中的赠送课时数
            iNow: -1,
            
            giftNewHourArr: new Array(), //新签赠送课时列表
            giftNewHour: 0, //新签赠送的课时数

            giftRenewHourArr: new Array(),//续费合同赠送课时列表
            giftRenewHour: 0, //续费合同赠送课时
        
            giftTttoHourArr: new Array(),//年级对应赠送课时列表
            giftTttoHour: 0, //年级对应赠送课时 isTtto
        
            giftPublicHourArr: new Array(),//公益课赠送课时列表
            giftPublicHour: 0, // 公益课赠送课时

            activityId: null,
            activityState: false,
            activityData: [], //优惠活动
            activityName: '',
            activityContent: '',
            activityPrice: '',
            activityHour: 0,

            cash: '',
            pos: '',
            wechatPay: '',
            aliPay: '',
            otherPay: '',
            inputVal: '', //输入总价
            tipState: false, //提示语显示状态
            differ: '', //输入的金额与合同价格的差价
            reg: /^[A-Za-z0-9]+$/,
            storeId: '',

            pageType: 'base-css',
            className: 'plan-wrap hidden',
            params: {},

            note: '' //备注
        };
    }

    componentWillMount() {
        this.contractDetail();
    }

    /*选择合同签订日期*/
    pickerSignDate(v) {
        this.setState({ dpValue: v });
    }

    /*初始化原合同信息*/
    contractDetail() {
       
        const params = {
            data:{
               contractId: this.props.match.params.contractId
            }
        };

        Http.ajax(`${api}/changgui/contracts/detail`,params).then(res => {
            if(res.code == 0){
                const contractDetail = res.data.contractDetail;
                this.setState({
                    contractDetail,
                    totalHours:contractDetail.totalHours,
                    restHour:contractDetail.restHour,
                    totalPrice:contractDetail.totalPrice,
                    actualPrice:contractDetail.actualPrice,
                    studentName:contractDetail.studentName,
                    leadId:contractDetail.leadId,
                    gradeId: res.data.gradeId,
                    operatorName: res.data.operatorName,
                    recommendDiscountPrice: contractDetail.recommendDiscountPrice
                },() => this.getStaffInfo() );
            }
        });
    }

    /*获取cc个人信息*/
    getStaffInfo() {

        Http.ajax(`${api}/changgui/staffs/self-info`,{}).then(res => {
            if(res.code == 0){
                this.setState({
                    storeId:res.data.selfInfo.storeId
                }, () => this.initClassHour() );
            }
        });
    }

    /*初始化课时数 e原合同课时数*/
    initClassHour() {

        let { classData, totalHours } = this.state;

        const params = {
            data:{
                originContractId: this.props.match.params.contractId
            }
        };

        Http.ajax(`${api}/changgui/selections/select-upgrade-hour-packages`,params).then(res => {
            if(res.code == 0){
                res.data.hourPackages.map((item,index) =>{
                    
                    if(item.hour > totalHours) classData.push(item);
                    
                    this.setState({ classData });
                });
            }
        });
    }

    /*选择课时 e为选择课时的id*/
    packageHour(e) {

        let { upRestHour, totalHours, restHour, actualPrice, diffPrice, calcPrice, leadId, storeId } = this.state;
        let { giftNewHourArr, giftRenewHourArr, giftTttoHourArr, giftPublicHourArr } = this.state;
        let { giftNewHour, giftRenewHour, giftTttoHour, giftPublicHour, recommendDiscountPrice } = this.state;

        const params = {
            data:{
                originContractId: this.props.match.params.contractId
            }
        };

        giftNewHourArr = new Array();
        giftRenewHourArr = new Array();
        giftTttoHourArr = new Array();
        giftPublicHourArr = new Array();

        giftNewHour = 0;
        giftRenewHour = 0;
        giftTttoHour = 0;
        giftPublicHour = 0;

        this.initActiveity(e);

        Http.ajax(`${api}/changgui/selections/select-upgrade-hour-packages`,params).then(res => {
            if(res.code == 0){
                res.data.hourPackages.map((item,index) => {
                    if(item.id == e){
                        
                        diffPrice = item.internalPrice - actualPrice - recommendDiscountPrice;
                        calcPrice = diffPrice; 
                        upRestHour = item.hour - totalHours + restHour;
                    
                        /*新签*/
                        if(item.bonusHours > 0) {
                            for(var i=0; i<=item.bonusHours; i+=2) {
                                giftNewHourArr.push(i);
                            }
                        }else {
                            giftNewHourArr = new Array();
                            giftNewHour = 0;
                        }

                        /*续费*/
                        if(item.resignBonusHours > 0) {
                            for(var i=0; i<=item.resignBonusHours; i+=2){
                                giftRenewHourArr.push(i);
                            }
                        }else {
                            giftRenewHourArr = new Array();
                            giftRenewHour = 0;
                        }

                        /*3321*/
                        if(item.tttoBonusHours > 0) {
                            for(var i=0; i<=item.tttoBonusHours; i+=2) {
                                giftTttoHourArr.push(i);
                            }
                        }else {
                            giftTttoHourArr = new Array();
                            giftTttoHour = 0;
                        }

                        /*公益课*/
                        if(item.publicTransferHours > 0) {
                            for(var i=0; i<=item.publicTransferHours; i+=2) {
                                giftPublicHourArr.push(i);
                            }
                        }else {
                            giftPublicHourArr = new Array();
                            giftPublicHour = 0;
                        }

                        this.setState({
                            upContactState: true,
                            packageId: e,
                            upHour: item.hour,
                            upTotalHour: item.hour,
                            calcUpTotalHour: item.hour,
                            upTotalPrice: item.internalPrice,
                            diffPrice,
                            upRestHour,
                            upRestTotalHour: upRestHour,
                            calcUpRestTotalHour: upRestHour,
                            giftNewHourArr,
                            giftRenewHourArr,
                            giftTttoHourArr,
                            giftPublicHourArr,

                            giftNewHour,
                            giftRenewHour,
                            giftTttoHour,
                            giftPublicHour,
                            calcPrice
                        }, () => this.handleChange() );
                    }
                });
            }
        });
    }

    /*赠送课时*/
    addGiftHour(tit, type, arr) {
        this.setState({
            showMask: true,
            showMaskTit: tit,
            giftHourArr: arr,
            giftType: type
        });
    }

    /*优惠活动列表*/
	initActiveity(hourPackageId) {
        
        const { gradeId, leadId } = this.state;
        const params = {
            data:{
                hourPackageId,
                gradeId, 
                leadId
            }
        };

        Http.ajax(`${api}/changgui/selections/select-new-contract-activities`,params).then(res => {
            if(res && res.code == 0){

                const actitvities = res.data.actitvities;
                const activityData = [];

                if(actitvities != ''){
                    activityData.push(actitvities.map(({ id: value, name: label, discountPrice: activityPrice, lessonGiftCnt: activityHour }) => ({ label, value, activityPrice, activityHour })));
                    this.setState({ activityData, activityState: true });
                }else
                    this.setState({ activityData: [], activityState: false });

                this.setState({
                    activityId: null,
                    activityName: '',
                    activityContent: '',
                    activityPrice: '',
                    activityHour: 0
                });
            }
        });
    }

    /*选择优惠活动*/
    pickerActivity(v) {
        
        let { activityPrice, activityHour, activityContent, activityName, diffPrice, calcPrice, activityId, upTotalHour, 
            upRestTotalHour, calcUpTotalHour, calcUpRestTotalHour } = this.state;
        const { activityData } = this.state;

        activityId = v[0];
        activityPrice = activityData[0].filter(item => item.value == v)[0].activityPrice;
        activityHour = activityData[0].filter(item => item.value == v)[0].activityHour;
        activityName = activityData[0].filter(item => item.value == v)[0].label;
        activityContent = (activityPrice != 0 ? ('减免' + activityPrice + '元 ') : '') + (activityHour != 0 ? ('赠送' + activityHour + '课时') : '');
        diffPrice = calcPrice - activityPrice;
        upTotalHour = calcUpTotalHour + activityHour;
        upRestTotalHour =  calcUpRestTotalHour + activityHour;
        calcUpTotalHour = upTotalHour;
        calcUpRestTotalHour = upRestTotalHour;

        this.setState({
            activityPrice,
            activityHour,
            activityContent,
            activityName,
            diffPrice,
            activityId,
            upTotalHour,
            upRestTotalHour,
            calcUpTotalHour,
            calcUpRestTotalHour
        }, () => this.handleChange() );
    }
    
    /*取消优惠活动*/
	deleteAcivity(){
        
        let { activityPrice, activityHour, activityContent, activityName, diffPrice, activityId, upTotalHour, 
            upRestTotalHour, calcUpTotalHour, calcUpRestTotalHour  } = this.state;
        
        upTotalHour = calcUpTotalHour - activityHour;
        upRestTotalHour =  calcUpRestTotalHour - activityHour;
        activityHour = 0;
        activityContent = '';
        activityName = '';
        diffPrice = diffPrice + activityPrice;
        activityPrice = 0;
        activityId = null;
        calcUpTotalHour = upTotalHour;
        calcUpRestTotalHour = upRestTotalHour;

        this.setState({
            upTotalHour,
            upRestTotalHour,
            activityPrice,
            activityHour,
            activityContent,
            activityName,
            diffPrice,
            activityId,
            calcUpTotalHour,
            calcUpRestTotalHour
        }, () => this.handleChange() );
    }

    /*输入备注*/
    note(v) {
        this.setState({ note: v });
    }

    /*确认赠送*/
    ensure() {

        const { giftType, giftHour, showMask, upHour, upRestHour, activityHour } = this.state;
        let { upTotalHour, upRestTotalHour, giftNewHour, giftRenewHour, giftPublicHour, giftTttoHour, calcUpTotalHour, calcUpRestTotalHour } = this.state;

        switch(giftType) {
            case 'giftNewHour':
                giftNewHour = giftHour;
                break;
            case 'giftRenewHour':
                giftRenewHour = giftHour;
                break;
            case 'giftPublicHour':
                giftPublicHour = giftHour;
                break;
            case 'giftTttoHour':
                giftTttoHour = giftHour;
                break;
        }

        upTotalHour = upHour + giftNewHour + giftRenewHour + giftPublicHour + giftTttoHour + activityHour;
        calcUpTotalHour = upTotalHour;
        upRestTotalHour = upRestHour + giftNewHour + giftRenewHour + giftPublicHour + giftTttoHour + activityHour;
        calcUpRestTotalHour = upRestTotalHour;

        this.setState({
            giftNewHour,
            giftRenewHour,
            giftPublicHour,
            giftTttoHour,
            upTotalHour,
            upRestTotalHour,
            showMask: false,
            iNow: -1,
            calcUpTotalHour,
            calcUpRestTotalHour
        });
    }

    /*输入金额*/
    handleChange(e,type) {
        this.setState({
            [type]:e
        },() => this.calc() );
    }

    /*计算差价*/
    calc() {

        let { cash, pos, wechatPay, aliPay, otherPay, diffPrice, tipState, differ, packageId, inputVal } = this.state;

        inputVal = Number(cash) + Number(pos) + Number(wechatPay) + Number(aliPay) + Number(otherPay);
        differ = diffPrice - inputVal;

        diffPrice != '' && inputVal != 0 &&
        this.setState({
            inputVal,
            tipState,
            differ
        });
    }

    // 确认课时规划到详情
    redirctTo() {
        this.props.history.push(`/UpContractCommit`)
    }

    /*提交*/
    commit() {

        let { signDate, studentName, packageId, cash, pos, wechatPay, aliPay, otherPay, inputVal, diffPrice, data,
            totalHours, totalPrice, upTotalHour, upTotalPrice, activityHour, activityId, note } = this.state;

        const { giftNewHour, giftRenewHour, giftPublicHour, giftTttoHour } = this.state; 
        
        let totalBonusHours = giftNewHour + giftRenewHour + giftPublicHour + giftTttoHour + activityHour;      
        

        if(packageId == ''){
            Toast.info('请选择课时',1);
            return false;
        }

        if(diffPrice != inputVal){
            Toast.info('请输入正确的金额',1);
            return false;
        }

        localStorage.setItem('upContract',JSON.stringify(this.state));
        
        const params = {
            method:'POST',
            data:{
                orginContractId:this.props.match.params.contractId,
                signDate,
                studentName,
                hourPackageId: packageId,
                diffPrice,
                cash,
                pos,
                aliPay,
                wechatPay,
                otherPay,
                activityId,
                totalHours,
                totalPrice,
                upTotalHour,
                upTotalPrice,
                totalBonusHours,
                newSignBonusHours: giftNewHour,
                reSignBonusHours: giftRenewHour,
                tttoBonusHours: giftTttoHour,
                publicTransferHours: giftPublicHour,
                note
            }
        };

        this.setState({
            className: 'show plan-wrap',
            pageType: 'hidden',
            params
        });
    }

    render() {

        const { signDate, dpValue, contractDetail, classData, packageId, note, activityContent, activityName, activityId, operatorName, activityState } = this.state;
        const { upTotalHour, upRestTotalHour, upTotalPrice, diffPrice, tipState, differ, upContactState } = this.state;
        const { showMask, showMaskTit, giftHourArr, iNow, giftNewHour, giftRenewHour, giftPublicHour, giftTttoHour, activityData } = this.state;
        const { giftNewHourArr, giftRenewHourArr, giftTttoHourArr, giftPublicHourArr, className, pageType, params, recommendDiscountPrice } = this.state;

        return(
            <div style={{height: '100%'}}>
                <div id='up-contract' className={pageType}>
                    {/*合同信息*/}
                    <div className="contract-sign base-line">
                        <div className="title"><i></i><h3>合同信息</h3></div>
                        <ul>
                            <li className="sign-date">
                                <label>签订日期：</label>
                                <DatePicker
                                    mode="date"
                                    title="选择日期"
                                    extra={ signDate }
                                    value={ dpValue }
                                    onChange={v => this.pickerSignDate(v) }
                                >
                                    <List.Item className="date-picker" />
                                </DatePicker>
                            </li>
                            <li>
                                <label>签&nbsp;&nbsp;订&nbsp;&nbsp;人：</label>
                                <p>{ operatorName }</p>
                            </li>
                        </ul>
                    </div>

                    {/*原合同信息*/}
                    <div className="old-contract">
                        <div className="title"><i></i><h3>升级合同</h3></div>
                        <ul className="contract-msg">
                            <li>
                                <label>原购买课时数：</label>
                                <span>{ contractDetail.hours }课时</span>
                            </li>
                            <li>
                                <label>已上课时数：</label>
                                <span>{ contractDetail.finishedHour }课时</span>
                            </li>
                            <li>
                                <label>原价：</label>
                                <span>{ contractDetail.actualPrice }元</span>
                            </li>
                        </ul>
                    </div>

                    {/*升级合同*/}
                    <div className="up-contract">
                        {
                            classData != '' &&
                            <div className="title up"><i></i><h3>升级到</h3></div>
                        }
                        <Flex wrap="wrap" className="up-grade">
                            {
                                classData.map((item,index) => {
                                    const active = packageId === item.id ? 'active' :'';
                                    return (
                                        <div onClick={ () => this.packageHour(item.id) } className={ active } key={ index }>{ item.hour }课时</div>
                                    )
                                })
                            }
                        </Flex>
                        {
                            upContactState &&
                            <ul className="new-msg">
                                {/*新签赠送*/}
                                {
                                    giftNewHourArr.length > 0 &&
                                    <li>
                                        <label>新签赠送：</label>
                                        { giftNewHour > 0 && <span>{ giftNewHour }课时</span> }
                                    </li>
                                }
                                {
                                    giftNewHourArr.length > 0 &&
                                    <li>
                                        <label className="add">请添加新签赠送：</label>
                                        <a href="javascript:void(0)" onClick={ () => this.addGiftHour('新签赠送课时', 'giftNewHour', giftNewHourArr) }>添加</a>
                                    </li>
                                }
                                
                                {/*续费赠送*/}
                                {
                                    giftRenewHourArr.length > 0 &&
                                    <li>
                                        <label className="add">续费赠送：</label>
                                        { giftRenewHour > 0 && <span>{ giftRenewHour }课时</span> }
                                    </li>
                                }
                                {
                                    giftRenewHourArr.length > 0 &&
                                    <li>
                                        <label className="add">请添加续费赠送：</label>
                                        <a href="javascript:void(0)" onClick={ () => this.addGiftHour('续费赠送课时', 'giftRenewHour', giftRenewHourArr)}>添加</a>
                                    </li>
                                }
                                
                                { /*公益课转化赠送*/ }
                                {
                                   giftPublicHourArr.length > 0 && 
                                   <li>
                                        <label>公益课转化赠送：</label>
                                        { giftPublicHour > 0 && <span>{ giftPublicHour }课时</span> }
                                    </li>
                                }
                                {
                                    giftPublicHourArr.length > 0 && 
                                    <li>
                                        <label className="add">请添加公益课转化赠送：</label>
                                        <a href="javascript:void(0)" onClick={ () => this.addGiftHour('公益课转化赠送课时', 'giftPublicHour', giftPublicHourArr)}>添加</a>
                                    </li>
                                }

                                {/*3321赠送*/}
                                {
                                    giftTttoHourArr.length > 0 &&
                                    <li>
                                        <label className="add">3321赠送：</label>
                                        { giftTttoHour > 0 && <span>{ giftTttoHour }课时</span> }
                                    </li>
                                }
                                {
                                    giftTttoHourArr.length > 0 &&
                                    <li>
                                        <label className="add">请添加3321赠送：</label>
                                        <a href="javascript:void(0)" onClick={ () => this.addGiftHour('3321赠送课时', 'giftTttoHour', giftTttoHourArr)}>添加</a>
                                    </li> 
                                }

                                {/* 优惠活动 */}
                                {
                                    activityState && 
                                    <li className="preferential">
                                        <label>优惠活动：</label>
                                        <Picker
                                            data={ activityData }
                                            title="优惠活动"
                                            cascade={ false }
                                            extra="选择"
                                            onChange={ v => this.pickerActivity(v) }
                                        >
                                            <List.Item className="picker-active" />
                                        </Picker>
                                    </li>
                                }

                                {
                                    activityId != null && 
                                    <li className='activity'>
                                        <label>{ activityName } </label>
                                        <Button 
                                            onClick={() => alert('优惠活动', `确定删除优惠活动吗？`, [
                                                { text: '取消' },
                                                { text: '确定', onPress: () => this.deleteAcivity() },
                                            ])}
                                        >删除
                                        </Button>
                                    </li>
                                }

                                {
                                    activityId != null &&
                                    <li className='activity'>
                                        <label>{ activityContent }</label>
                                    </li>
                                }
                                <li>
                                    <label>升级后总课时:</label>
                                    <span>{ upTotalHour }课时</span>
                                </li>
                                <li className="align-betw">
                                    <label>升级后剩余课时:</label>
                                    <span>{ upRestTotalHour }课时</span>
                                </li>
                                <li>
                                    <label>升级后总价:</label>
                                    <span>{ upTotalPrice }元</span>
                                </li>
                                {
                                    recommendDiscountPrice != 0 &&
                                    <li>
                                        <label>口碑优惠：</label>
                                        <span>{ -recommendDiscountPrice }元</span>
                                    </li>
                                }
                                <li className="diff-price">
                                    <label>需补差价:</label>
                                    <p><strong>{ diffPrice }</strong><span>元</span></p>
                                </li>
                            </ul>
                        }
                        {
                            upContactState &&
                            <div className="note">
                                <label>合同备注：</label>
                                <List>
                                    <TextareaItem
                                        placeholder="请输入合同备注"
                                        data-seed="logId"
                                        autoFocus
                                        autoHeight
                                        value={note}
                                        count="120"
                                        onChange={ (v) => this.note(v) }
                                    />
                                </List>
                            </div>
                        }
                    </div>

                    {/*赠送课时弹框*/}
                    <Modal 
                        className="present-modal ht-hours-modal"
                        title={ showMaskTit }
                        visible={ showMask } 
                        transparent="true"
                    >
                        <div className="discount">
                            <Flex className="list" wrap="wrap">
                                {
                                    giftHourArr.map((item,index) =>{
                                        var activeName = iNow === index ? 'active' :'';
                                        return <div key={ index } onClick={ () => this.setState({ giftHour: item, iNow: index }) } className={ activeName }>{ item }</div>
                                    })
                                }
                            </Flex>
                            <Button onClick={ () => this.ensure() }>确认赠送</Button>
                            <i className="close" onClick={ () => this.setState({ showMask: false }) }></i>
                        </div>
                    </Modal>

                    {/*核算金额*/}
                    <div className="pay-wrap">
                        <div className="title up"><i></i><h3>支付</h3></div>
                        {
                            differ > 0 &&
                            <div className="tip">
                                <label>支付金额比合同金额少</label>
                                <span>元</span>
                                <span className="cash">{ differ }</span>
                            </div>
                        }
                        {
                            differ < 0 &&
                            <div className="tip">
                                <label>支付金额比合同金额多</label>
                                <span>元</span>
                                <span className="cash">{ -differ }</span>
                            </div>
                        }
                        <List className="iput-wrap">
                            <InputItem
                                className="cash"
                                type='number'
                                placeholder="请输入现金数额"
                                onBlur={ (e) => this.handleChange(e,'cash') }
                            >
                                现金
                            </InputItem>
                            <InputItem
                                className="pos"
                                type='number'
                                placeholder="请输入POS机数额"
                                onBlur={ (e) => this.handleChange(e,'pos') }
                            >
                                POS机
                            </InputItem>
                            <InputItem
                                className="wx"
                                type='number'
                                placeholder="请输入微信支付数额"
                                onBlur={ (e) => this.handleChange(e,'wechatPay') }
                            >
                                微信支付
                            </InputItem>
                            <InputItem
                                className="zfb"
                                type='number'
                                placeholder="请输入支付宝数额"
                                onBlur={ (e) => this.handleChange(e,'aliPay') }
                            >
                                支付宝
                            </InputItem>
                            <InputItem
                                className="other"
                                type='number'
                                placeholder="请输入其它付款方式数额"
                                onBlur={ (e) => this.handleChange(e,'otherPay') }
                            >
                                其他
                            </InputItem>
                        </List>
                    </div>
                    <Button onClick={ ()=> this.commit() }>确认</Button>
                </div>
                <UpPlanHour 
                    className={ className } 
                    totalHour={ upTotalHour - contractDetail.totalHours } 
                    redirctTo={ (data) => this.redirctTo(data) } 
                    params={ params }
                    contractId={ this.props.match.params.contractId }
                    ref="newplanhour"
                />
            </div>
        );
    }
}

module.exports = UpContract;