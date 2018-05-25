
import { Flex, Button, Toast } from 'antd-mobile';

const Http = Base
const { api: URL } = Http.url

class SelectStu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPublic: this.props.history.location.search == '?1' ? true : false,
            contractId: this.props.match.params.contractId,
            leadId: this.props.match.params.leadId,
            selectStuId: null, // 选中的学员id
            selectStuList: [] // 学员列表
        };
    }

    componentWillMount() {
        this.initStu();
    }

    // 初始化学员列表
    initStu() {

        const { isPublic, contractId, leadId } = this.state;
        const params = { data: { contractId } };

        Http.ajax(`${URL}/changgui/contracts/get-contract-students`, params).then(res => {
            if(res && res.code == 0) {

                const leadStudents = res.data.leadStudents;
                const studId = res.data.leadStudents[0].leadStudentId;

                if(leadStudents.length == 1) {
                    if(isPublic) 
                        this.props.history.push(`/NewContract/${leadId}/${studId}#${contractId}`);
                    else 
                        this.props.history.push(`/NewContract/${leadId}/${studId}?${contractId}`);
                }
                else
                    this.setState({ selectStuList: res.data.leadStudents });
            } 
        }); 
    }

    // 选择学员
    handleSelect(v) {
        this.setState({ selectStuId: v });
    }
    
    // 取消
    cancel() {
        window.history.back();
    }

    // 添加
    commit() {

        const { selectStuId, isPublic, contractId, leadId } = this.state;

        if(selectStuId == null) {
            Toast.info('请选择学员', 1);
            return false;
        }

        if(isPublic) 
            this.props.history.push(`/NewContract/${leadId}/${selectStuId}#${contractId}`);
        else 
            this.props.history.push(`/NewContract/${leadId}/${selectStuId}?${contractId}`);
    }

    render() {

        const { selectStuList, selectStuId } = this.state;

        return (
            <div id="signContractEn">
                <div className="regio">
                    <div className="title">学员</div>
                    <Flex className="list-box">
                        {
                            selectStuList.map(item => (
                                <div 
                                    key={ item.leadStudentId } 
                                    className={ item.leadStudentId == selectStuId ? 'list active' : 'list' }
                                    onClick={ () => this.handleSelect(item.leadStudentId) }
                                >
                                    { item.studentName }
                                </div>
                            ))
                        }
                    </Flex>
                </div>
                <Flex className="btns">
                    <Button className="btn" onClick={ () => this.cancel() }>取消</Button>
                    <Button className="btn" onClick={ () => this.commit() }>添加</Button>
                </Flex>
            </div>
        )
    }
};

export default SelectStu;