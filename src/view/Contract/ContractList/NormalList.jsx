
import { SearchBar, Flex, Picker, List, Toast } from 'antd-mobile';

import ListWrap from '../../../component/List.jsx';
import './NormalList.less';

const Http = Base;
const { Api: URL } = Http.url;
const { Link } = ReactRouterDOM;

class NormalList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            type: this.props.match.params.id,
            headerDate: [],
            total: '60',
            listItem: [],
            name: '',
            contractType: [[]],
            contractState: [[]],
            courseIdState: [[]],
            checkedType: '',
            checkedState: '',
            courseId: '',
            ourHeight: 0,
            page: 1,
            per_page: 20,
            value: '',
            load: true,
        }
    }

    componentWillMount() {

        this.initHeader();
        this.initContractType();
        this.initContractStatus();
        this.onload();

        if (this.state.type == 'PUBLIC')
            this.initPublicCourse();
    }

    componentDidMount() {

        const outheight = document.body.clientHeight - document.getElementById('hedder').offsetHeight * 1.5;

        this.setState({ ourHeight: outheight });
    }

    // 初始化头部
    initHeader() {

        let { headerDate } = this.state;
        const { type } = this.state;

        if (type == 'all' || type == 'Scalable')
            headerDate = ['姓名', '日期', '价格', '剩余课时'];
        else if (type == 'PUBLIC')
            headerDate = ['姓名', '日期', '课程', '电话', '剩余课时'];
        else if (type == 'expired')
            headerDate = ['姓名', '日期', '价格'];
        else
            headerDate = ['姓名', '日期', '价格', '状态'];

        this.setState({ headerDate });
    }

    // 初始化公益课课程
    initPublicCourse() {

        const params = { method: 'POST' };

        Http.ajax(`${URL}/selections/get-public-courses`, params).then(res => {
            if (res && res.code == 0) {

                const newArray = res.data.response.map(({ id: value, text: label }) => ({ value, label }));

                newArray.push({ label: '全部课程', value: '' });
                this.setState({ courseIdState: [newArray] });
            }
        });
    }

    // 初始化合同类型
    initContractType() {

        const paramsstu = {
            method: 'post',
            formData: true
        };

        Http.ajax(`${URL}/selections/contract-type`, paramsstu).then(res => {
            if (res && res.code == 0) {

                const newArray = res.data.mappers.map(({ id: value, text: label }) => ({ value, label }));
                newArray.push({ label: '全部类型', value: '' });

                this.setState({ contractType: [newArray] });
            }
        });
    }

    // 初始化合同状态
    initContractStatus() {

        let Dataarray = [];
        const { type } = this.state;
        const contract = {
            method: 'post',
            formData: true,
        };

        if(type == 'all' || type == 'Scalable' || type == 'expired') {
            Http.ajax(`${URL}/selections/audit-status`, contract).then(res => {
                if (res && res.code == 0) {

                    Dataarray = res.data.mappers.map(({ id: value, text: label }) => ({ value, label }));
                    Dataarray.push({ label: '全部状态', value: '' });

                    this.setState({ contractState: [Dataarray] });
                }
            });
        } else {
            Http.ajax(`${URL}/selections/contract-status`, contract).then(res => {
                if (res && res.code == 0) {

                    Dataarray = res.data.mappers.map(({ id: value, text: label }) => ({ value, label }));
                    Dataarray.push({ label: '全部状态', value: '' });

                    this.setState({ contractState: [Dataarray] });
                }
            });
        }
    }

    onload() {

        const { page, per_page, listItem, courseId, checkedType, checkedState, name, type } = this.state;
        const paramsstu = {
            method: 'post',
            formData: true,
            data: {
                page,
                per_page,
                value: name,
                contractType: checkedType,
            }
        };

        if (type == 'all') {
            paramsstu.data.auditStatus = checkedState;
        }

        if (type == 'Scalable') {//可升级
            paramsstu.data.upgraded = true;
            paramsstu.data.auditStatus = checkedState;
        }

        if (type == 'PUBLIC') {//公益课
            paramsstu.data.contractCategory = 'PUBLIC';
            paramsstu.data.courseId = courseId;
            paramsstu.data.contractStatus = checkedState;
        }

        if (type == 'AUDITING') {
            paramsstu.data.auditStatus = 'AUDITING';
        }

        if (type == 'expired') { //已过期
            paramsstu.data.expired = true;
            paramsstu.data.auditStatus = checkedState;
        }

        Http.ajax(`${URL}/changgui/contracts/list`, paramsstu).then(res => {
            if (res.code == 0) {
                if (res.data.contracts.length > 0) {
                    if (page == 1) {
                        this.setState({
                            listItem: res.data.contracts,
                            total: res.data.total,
                            load: true
                        });
                    } else {
                        this.setState({
                            listItem: listItem.concat(res.data.contracts),
                            load: true
                        });
                    }
                } else {
                    if (page == 1) {
                        this.setState({
                            listItem: [],
                            load: true
                        });
                    } else {
                        Toast.info('没有更多数据啦', 1);
                    }
                }
            }
        });
    }

    /*搜索*/
    search(v) {

        const { name, page, per_page, load } = this.state;
        if (load) {
            this.setState({
                name: v,
                page: 1,
                per_page: 20,
                load: false
            }, () => this.onload());
        }
    }

    //渲染合同列表
    _renderList(data) {
        const { type } = this.state;
        return (
            type == 'PUBLIC' ?
                data.map((item, index) => {
                    return (
                        <Link key={'list' + index} to={`/ContractDetail/${item.id}`} >
                            <Flex >
                                <Flex.Item style={{ width: '18%' }}>
                                    {
                                        item.studentName.map((name, index) => {
                                            return <span key={index}>
                                                {
                                                    index > 0 && '/'
                                                }
                                                <span>{name}</span>
                                            </span>
                                        })
                                    }
                                </Flex.Item>
                                <Flex.Item style={{ width: '20%' }}> {(item.contractDate).substring(2)} </Flex.Item>
                                <Flex.Item style={{ width: '19%' }}> {item.courseName} </Flex.Item>
                                <Flex.Item style={{ width: '28%' }}> {item.mobile} </Flex.Item>
                                <Flex.Item style={{ width: '15%' }}> {item.existCourse} </Flex.Item>
                            </Flex>
                        </Link>
                    )
                }) :
                data.map((item, index) => {
                    return (
                        <Link key={'list' + index} to={`/ContractDetail/${item.id}`} >
                            <Flex >
                                <Flex.Item>
                                    {
                                        item.studentName.map((name, index) => {
                                            return <span key={index}>
                                                {index > 0 && '/'}
                                                <span>{name}</span>
                                            </span>
                                        })
                                    }
                                </Flex.Item>
                                <Flex.Item> {item.contractDate} </Flex.Item>
                                <Flex.Item> {item.contractAmount} </Flex.Item>
                                {
                                    type != 'expired' &&
                                    <Flex.Item> {(type == 'all' || type == 'Scalable') ? item.existCourse : item.contractStatusName} </Flex.Item>
                                }
                            </Flex>
                        </Link>
                    )
                })
        );
    }

    //滑动到页面底部
    _slideLast() {
        const { total, page, per_page, load } = this.state;
        let pages = Math.ceil(total / per_page);
        if (load) {
            if (page <= pages) {
                let pagenow = page + 1
                this.setState({
                    page: pagenow,
                    load: false
                })
                this.onload();
            }
        }
    }
    /* 选择合同课程*/
    onCoursrId(v, test) {
        const { courseId, page, per_page, load, total } = this.state;
        let pages = Math.ceil(total / per_page);
        if (page <= pages) {
            this.setState({
                courseId: v,
                page: 1,
                per_page: 20,
            }, () => this.onload());
        }
    }
    /*选择合同类型*/
    onChangeType(v, tst) {

        const { checkedType, page, per_page, load, total } = this.state;
        let pages = Math.ceil(total / per_page);

        if (page <= pages) {
            this.setState({
                [tst]: v,
                page: 1,
                per_page: 20,
            }, () => this.onload());
        }
    }

    /*选择合同状态*/
    onChangeState(v, tst) {

        const { checkedType, page, per_page, total } = this.state;
        let pages = Math.ceil(total / per_page);

        if (page <= pages) {
            this.setState({
                checkedState: v,
                page: 1,
                per_page: 20,
                checkedType,
            }, () => this.onload())
        }
    }

    render() {

        const { type, headerDate, listItem, contractType, courseIdState, contractState, ContractTeacher, ourHeight } = this.state;

        return (
            <div id="normal-list">
                <div id='hedder'>
                    <SearchBar
                        placeholder="搜索"
                        cancelText="搜索"
                        onCancel={(v) => this.search(v)}
                    />
                    <ul className="select-wrap">
                        {/*班级*/}
                        {
                            type == 'PUBLIC' ?
                                <li style={{ width: type == "PUBLIC" ? "50%" : '0', margin: type == 'PUBLIC' ? '0 auto' : '' }}>
                                    <Picker
                                        data={courseIdState}
                                        title={'全部课程'}
                                        cascade={false}
                                        extra={'全部课程'}
                                        value={this.state['courseId']}
                                        onChange={(v) => this.onCoursrId(v, 'courseId')}
                                    >
                                        <List.Item />
                                    </Picker>
                                </li> : ''
                        }

                        {/*合同类型排序*/}
                        {
                            type != 'PUBLIC' &&
                            <li style={{ width: type == "PUBLIC" ? "30%" : '48%', margin: type == 'AUDITING' ? '0 auto' : '' }}>
                                <Picker
                                    data={contractType}
                                    title={'合同类型'}
                                    cascade={false}
                                    extra={'合同类型'}
                                    value={this.state['checkedType']}
                                    onChange={(v) => this.onChangeType(v, 'checkedType')}
                                >
                                    <List.Item />
                                </Picker>
                            </li>
                        }


                        {/*明细状态排序*/}
                        {
                            (type != 'AUDITING' && type != 'PUBLIC') &&
                            <li style={{ width: type == "PUBLIC" ? "30%" : '48%' }}>
                                <Picker
                                    data={contractState}
                                    title={'合同状态'}
                                    cascade={false}
                                    extra={'合同状态'}
                                    value={this.state['checkedState']}
                                    onChange={(v) => this.onChangeState(v, 'checkedState')}
                                >
                                    <List.Item />
                                </Picker>
                            </li>
                        }
                    </ul>
                </div>
                <ListWrap
                    wrapHeight={ourHeight}
                    isShowHeader={true}
                    data={listItem}
                    headerDate={headerDate}
                    renderList={this._renderList.bind(this)}
                    slideLast={this._slideLast.bind(this)}
                />
            </div>
        );
    }
}

module.exports = NormalList;