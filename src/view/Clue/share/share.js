
import { Picker, List, Toast, Button, Modal } from 'antd-mobile';
import './share.less';

const Http = Base
const { api: URL } = Http.url

class AdjustClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leadId: Number(this.props.match.params.leadId),
            pickerData: [
                {
                    data: [[]],
                    title: '事业部',
                    id: null,
                    disabled: false
                }, {
                    data: [[]],
                    title: '分馆',
                    id: null,
                    disabled: true
                }, {
                    data: [[]],
                    title: '所属人',
                    id: null,
                    disabled: true
                }
            ]
        }
    }  

    componentWillMount() {
        this.initCompanies();
    }

    // 初始化事业部
    initCompanies() {
        Http.ajax(`${URL}/changgui/selections/select-companies`, {}).then(res => {
            if(res && res.code == 0) {

                const { pickerData } = this.state;
                const companies = res.data.companies;
               
                pickerData[0].data[0] = companies.map(item => {
                    const { name: label, id: value } = item;
                    return { label, value };
                });

                this.setState({ pickerData });
            }
        });
    } 

    // 初始化分馆
    initStores(v) {

        const params = { data: { companyId: v } };

        Http.ajax(`${URL}/changgui/selections/select-stores`, params).then(res => {
            if(res && res.code == 0) {

                const { pickerData } = this.state;
                const stores = res.data.stores;
               
                pickerData[1].data[0] = stores.map(item => {
                    const { name: label, id: value } = item;
                    return { label, value };
                });

                this.setState({ pickerData });
            }
        });
    } 

    // 初始化所属人
    initCCs(v) {

        const params = { data: { storeId: v } };

        Http.ajax(`${URL}/changgui/selections/select-store-ccs`, params).then(res => {
            if(res && res.code == 0) {

                const { pickerData } = this.state;
                const ccs = res.data.ccs;
               
                pickerData[2].data[0] = ccs.map(item => {
                    const { name: label, id: value } = item;
                    return { label, value };
                });

                this.setState({ pickerData });
            }
        });
    }

    // 选择日期、时间、教室、老师、分馆
    // index => 选择的类型  v => 选择的数据
    handleChange(index, v) {
        
        const { pickerData } = this.state;

        if(index == 0) {
            pickerData[1].disabled = false;
            if(v != pickerData[0].id) {
                this.initStores(v[0]);
                pickerData[1].id = null;
                pickerData[2].id = null;
            }
        }

        if(index == 1) {
            pickerData[2].disabled = false;
            if(v != pickerData[1].id) {
                this.initCCs(v[0]);
                pickerData[2].id = null;
            }
        }

        pickerData[index].id = v;
        this.setState(pickerData);
    }

    // 选择 教室、老师 前判断是否选择分馆 
    // index => 选择的类型
    handleClick(index) {
        
        const { pickerData } = this.state;

        if(index == 1 && pickerData[0].id == null) {
            Toast.info('请选择事业部', 1);
            return false;
        }

        if(index == 2 && pickerData[1].id == null) {
            Toast.info('请选择分馆', 1);
            return false;
        }
    }

    // 确认分享
    commit() {

        const { leadId, pickerData } = this.state;
        const params = {
            method: 'POST',
            formData: true,
            data: {
                leadId,
                targetCcId: pickerData[2].id[0]
            }
        };

        Http.ajax(`${URL}/lead/transfer-lead`, params).then(res => {
            if(res && res.code == 0) {
                if(res.data.isSameCompany) 
                    Modal.alert('', `同事业部线索推荐成功`, [
                        { text: '确定', onPress: () => this.back() },
                    ]);
                else 
                    Modal.alert('', `跨事业部线索推荐成功，等待教务审核`, [
                        { text: '确定', onPress: () => this.redirctTo() },
                    ]);
            }
        });
    }

    back() {
        window.history.back();
    }

    redirctTo() {
        this.props.history.push(`/clueList`);
    }

    render() {

        const { pickerData } = this.state;

        return (
            <div className="adjust-class">
                <h3>请填写分享信息</h3>
                <div className="select-wrap">
                    {
                        pickerData.map((item, index) => (
                            <Picker
                                key={ index }
                                data={ item.data }
                                title={ item.title }
                                cascade={ false }
                                extra={ '请' + item.title }
                                value={ item.id }
                                disabled={ item.disabled }
                                onChange={ v => this.handleChange(index, v) }
                            >
                                    <List.Item arrow="horizontal" onClick={ () => this.handleClick(index) } />
                            </Picker>
                        ))
                    }
                </div>
                <Button onClick={ () => this.commit() }>确认分享</Button>
            </div>
        ) 
    }
};

export default AdjustClass;