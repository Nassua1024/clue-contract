import Home from './view/Clue/visitTable/Home'
import AddName from './view/Clue/addClue/AddName'
import Addgender from './view/Clue/addClue/Addgender'
import AddStdName from './view/Clue/addClue/AddStdName'
import AddStdGender from './view/Clue/addClue/AddStdGender'
import PublicPraiseStd from './view/Clue/addClue/addPublicPraiseStd'

import AddStdType from './view/Clue/addClue/AddStdType'
import AddTel from './view/Clue/addClue/AddTel'
import AddCourse from './view/Clue/addClue/AddCourse'
import AddSource from './view/Clue/addClue/AddSource'
import AddConfirm from './view/Clue/addClue/AddConfirm'

import ResultContainer from './view/Clue/resultClue/ResultContainer'
import FollowUpListen from './view/Clue/followUp/listen/followListen'
import FollowUpVisit from './view/Clue/followUp/visit/followUpVisit'
import ListenDetail from './view/Clue/clueDetail/listenDetail/ListenDetail'
import AddAudition from './view/Clue/clueDetail/addAuditionList/addAuditionList'

import ClueList from './view/Clue/clueList/clueList'
import Search from './view/Clue/clueList/search/search'
import SignContractEn from './view/Clue/followUp/signContract/signContractEn'
import FollowUpReContact from './view/Clue/followUp/recontact/followUpReContact'

import ClueDetail from './view/Clue/clueDetail/clueDetail'
import ClueModify from './view/Clue/followUp/ClueModify'
import ListenTime from './view/Clue/addFollowUpRecord/selListenTime'
import RecordListen from './view/Clue/addFollowUpRecord/RecordListen'
import RecordVisit from './view/Clue/addFollowUpRecord/RecordVisit'
import RecordLianxi from './view/Clue/addFollowUpRecord/RecordLianXi'

import ClientLabel from './view/Clue/addLabel/clientLabel'
import InterestLabel from './view/Clue/addLabel/interestLabel'

import AudioSheet from './view/Clue/followUp/auditionSheet/auditionSheet'
import Share from './view/Clue/share/share'

import IndexView from './view/indexView.jsx'

/* contract-start */
import Index from './view/Contract/Index.jsx';
import FirstIndex from './view/FirstIndex.jsx';
import NormalList from './view/Contract/ContractList/NormalList.jsx';
import SpecialList from './view/Contract/ContractList/SpecialList.jsx';
import DueList from './view/Contract/ContractList/DueList.jsx';
import ContractPreview from './view/Contract/ContractPreview/ContractPreview';
import CourseArrangement from './view/Contract/CourseArrangement/CourseArrangement';


import ContractPay from './view/Contract/ContractPay/ContractPay';

import ContractDetail from './view/Contract/ContractDetail/ContractDetail';
import ArrayCourse from './view/Contract/ContractDetail/ArrayCourse';
import OperationList from './view/Contract/MoreOperation/OperationList';
import NewContract from './view/Contract/MoreOperation/NewContract/NewContract';
import PublicContract from './view/Contract/MoreOperation/NewContract/PublicContract';

import PraiseContract from './view/Contract/MoreOperation/NewContract/PraiseContract';
import UpContract from './view/Contract/MoreOperation/UpContract/UpContract';
import UpContractCommit from './view/Contract/MoreOperation/UpContract/UpContractCommit';
import Fendan from './view/Contract/MoreOperation/Fendan/Fendan';
import AddStu from './view/Contract/MoreOperation/AddStu/AddStu';
import AddStuCommit from './view/Contract/MoreOperation/AddStu/AddStuCommit';

import ClassDonation from './view/Contract/MoreOperation/ClassDonation/ClassDonation';
import DonationResult from './view/Contract/MoreOperation/ClassDonation/DonationResult';
import ChangeCourse from './view/Contract/MoreOperation/ChangeCourse/ChangeCourse';
import ChangeResult from './view/Contract/MoreOperation/ChangeCourse/ChangeResult';

import ContractTransfer from './view/Contract/MoreOperation/ContractTransfer/ContractTransfer';
import TransferDetail from './view/Contract/MoreOperation/ContractTransfer/TransferDetail';
import FreezeContract from './view/Contract/MoreOperation/FreezeContract/FreezeContract';
import SingleContract from './view/Contract/MoreOperation/SingleContract/SingleContract';
import ApplyRefund from './view/Contract/MoreOperation/ApplyRefund/ApplyRefund';
import ApplyRefundAudit from './view/Contract/MoreOperation/ApplyRefund/ApplyRefundAudit';
import VoidApplication from './view/Contract/MoreOperation/VoidApplication/VoidApplication';
import SelectStu from './view/Contract/MoreOperation/XuFeiSelectStu/SelectStu';

import ApplySpecial from './view/Contract/MoreOperation/ApplySpecial/ApplySpecial';
import ConfirmSpecial from './view/Contract/MoreOperation/ApplySpecial/ConfirmSpecial';
import AddSpecial from './view/Contract/MoreOperation/ApplySpecial/AddSpecial';
import SpecialDetail from './view/Contract/MoreOperation/ApplySpecial/SpecialDetail';
import PlanHour from './view/Contract/PlanHour/PlanHour';


/* contract-end */
import store from './redux/store/store';

import '../base.css';

const { Provider } = ReactRedux
const {HashRouter, Route} = ReactRouterDOM

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <HashRouter>
                <div>
                    <Route path="/" component={IndexView} />
                    <Route path="/FirstIndex" component={FirstIndex} />

                    {/* contract */}

                    <Route exact path="/Index" component={Index} />
                    <Route exact path="/NormalList/:id" component={NormalList} />
                    <Route exact path="/SpecialList" component={SpecialList} />
                    <Route exact path="/DueList" component={DueList} />
                    <Route exact path="/CourseArrangement/:contractStudentId" component={CourseArrangement} />
                    <Route exact path="/NewContract/:leadId/:stuId" component={NewContract} />
                    <Route exact path="/PublicContract/:leadStudentId/:stuId" component={PublicContract} />
                    <Route exact path="/PraiseContract/:contractId" component={PraiseContract} />
                    <Route exact path="/ContractPreview" component={ContractPreview} />
                    <Route exact path="/ContractDetail/:contractId" component={ContractDetail} />
                    <Route exact path="/ArrayCourse/:contractId" component={ArrayCourse} />
                    <Route exact path="/OperationList/:contractId/:leadId" component={OperationList} />
                    <Route exact path="/UpContract/:contractId" component={UpContract} />
                    <Route exact path="/UpContractCommit" component={UpContractCommit} />
                    <Route exact path="/Fendan/:contractId" component={Fendan} />
                    <Route exact path="/AddStu/:contractId" component={AddStu} />
                    <Route exact path="/AddStuCommit" component={AddStuCommit} />
                    <Route exact path="/SelectStu/:contractId/:leadId" component={SelectStu} />
                    <Route exact path="/ContractTransfer/:contractId" component={ContractTransfer} />
                    <Route exact path="/TransferDetail/:contractId" component={TransferDetail} />
                    <Route exact path="/FreezeContract/:contractId" component={FreezeContract} />
                    <Route exact path="/SingleContract/:contractId" component={SingleContract} />
                    <Route exact path="/ApplyRefund/:contractId" component={ApplyRefund} />
                    <Route exact path="/ApplyRefundAudit" component={ApplyRefundAudit} />
                    <Route exact path="/VoidApplication/:contractId" component={VoidApplication} />
                    <Route exact path="/ContractPay" component={ContractPay} />
                    <Route exact path="/ClassDonation" component={ClassDonation} />
                    <Route exact path="/DonationResult" component={DonationResult} />
                    <Route exact path="/ChangeCourse" component={ChangeCourse} />
                    <Route exact path="/ChangeResult" component={ChangeResult} />
                    <Route exact path="/ApplySpecial/:leadId" component={ApplySpecial} />
                    <Route exact path="/ConfirmSpecial/:leadId" component={ConfirmSpecial} />
                    <Route exact path="/AddSpecial/:specialId" component={AddSpecial} />
                    <Route exact path="/SpecialDetail/:specialId" component={SpecialDetail} />
                    <Route exact path="/PlanHour/:hour" component={PlanHour} />
                    <Route exact path="/Share/:leadId" component={Share} />
                    
                    {/* clue */}
                    <Route exact path="/Home" component={Home} />

                    <Route path='/clueList' component={ClueList} />
                    <Route path='/clueList-search' component={Search} />

                    <Route path="/clueDetail/:id" component={ClueDetail} />
                    <Route path='/recordListen/:id' component={RecordListen} />
                    <Route path='/recordVisit/:id' component={RecordVisit} />
                    <Route path='/recordLianxi/:id' component={RecordLianxi} />
                    <Route path='/selListenTime/:id/:courseId' component={ListenTime} />

                    <Route path="/add/name"   component={AddName} />
                    <Route path="/add/gender"  component={Addgender} />
                    <Route path="/add/student-name"  component={AddStdName} />
                    <Route path="/add/student-gender"  component={AddStdGender} />
                    <Route path="/add/student-type"  component={AddStdType} />
                    <Route path='/add/tel'    component={AddTel} />
                    <Route path='/add/source' component={AddSource} />
                    <Route path='/add/public-std/:isPublic' component={PublicPraiseStd} />
                    <Route path='/add/course' component={AddCourse} />
                    <Route path='/add/confirm-clue' component={AddConfirm} />
                    <Route path='/addClueResult/:id' component={ResultContainer} />

                    <Route path='/client-label/:prev/:id' component={ClientLabel} />
                    <Route path='/interest-label' component={InterestLabel} />

                    <Route path='/followup/listen/:id/:leadHistoryId' component={FollowUpListen} />
                    <Route path='/followup/visit/:id/:leadHistoryId' component={FollowUpVisit} />
                    <Route path='/followup/recontact/:id/:leadHistoryId' component={FollowUpReContact} />

                    <Route path='/signContractEn/:leadId' component={SignContractEn} />
                    <Route path='/ClueModify/:id' component={ClueModify} />

                    <Route path='/AudioSheet/:id' component={AudioSheet} />
                    <Route path='/listenDetail/:id' component={ListenDetail} />
                    <Route path='/addAudition/:id' component={AddAudition} />


                </div>
            </HashRouter>
        )
    }
}



ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('view')
);

