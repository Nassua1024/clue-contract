import { Grid } from 'antd-mobile';

import './Index.less';

const { Link } = ReactRouterDOM;
const Http = Base;
const api = Base.url.Api;

class Index extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            test: 'Hello React',
            data: [
                {
                    icon: require('../../img/all-contract.png'),
                    iconnum: '',
                    operation: 'all',
                    index: 1
                }, {
                    icon: require('../../img/jijiangdaoqi.png'),
                    iconnum: '',
                    operation: 'Due',
                    index: 2
                }, {
                    icon: require('../../img/keshengji.png'),
                    iconnum: '',
                    operation: 'Scalable',
                    index: 3
                }, {
                    icon: require('../../img/auditing.png'),
                    iconnum: '',
                    operation: 'AUDITING',
                    index: 4
                }, {
                    icon: require('../../img/gongyike.png'),
                    iconnum: '',
                    operation: 'PUBLIC',
                    index: 5
                }, {
                    icon: require('../../img/guoqi.png'),
                    iconnum: '',
                    operation: 'expired',
                    index: 6
                }
            ]
            // {
            //     icon: require('../../img/daipaike.png'),
            //     type: '0',
            //     iconnum: '',
            //     operation: 'waitingLesson',
            //     index: 2
            // },  {
            //     icon: require('../../img/audit-no-pass.png'),
            //     iconnum: '',
            //     type: '0',
            //     index: 5
            // },  {
            //     icon: require('../../img/chuqinlv.png'),
            //     type: '1',
            //     iconnum: '',
            //     operation: 'Attendance',
            //     index: 7
            // },
        };
    }

    componentWillMount() {
       
        const { data } = this.state;
        const params = {
            method: 'post',
            formData: true
        }
        Http.ajax(`${api}/changgui/contracts/home-statistic`, params).then(res => {
            
            data[ 0 ].iconnum = res.data.data.quanbu > 1000 ? '···' : res.data.data.quanbu
            data[ 1 ].iconnum = res.data.data.jiangdaoqi > 1000 ? '···' : res.data.data.jiangdaoqi
            data[ 2 ].iconnum = res.data.data.keshengji > 1000 ? '···' : res.data.data.keshengji
            data[ 3 ].iconnum = res.data.data.auditing > 1000 ? '···' : res.data.data.auditing
            data[ 4 ].iconnum = res.data.data.gongyi > 1000 ? '···' : res.data.data.gongyi
            data[ 5 ].iconnum = res.data.data.guoqi > 1000 ? '···' : res.data.data.guoqi
           
            // data[ 1 ].iconnum = res.data.data.daiPaike > 1000 ? '···' : res.data.data.daiPaike
            // data[ 3 ].iconnum = res.data.data.auditFail > 1000 ? '···' : res.data.data.auditFail
            // data[ 4 ].iconnum = res.data.data.chuqin > 1000 ? '···' : res.data.data.chuqin

            this.setState({ data })
        });
    }

    linkTo(_el, index) {
      
        const id = _el.operation != undefined ? _el.operation : '';

        if(_el.index == 2) 
            this.props.history.push(`/DueList`);
        else
        this.props.history.push(`/NormalList/${id}`); //全部
    }

    render() {
        const { data } = this.state;
        return (
            <div id="main-list" className=''>
                <Grid 
                    data={ data } 
                    columnNum={ 3 } 
                    hasLine={ false } 
                    onClick={ (_el, index) => this.linkTo(_el, index) } 
                    renderItem={ dataItem => (
                        <div>
                            <img src={ dataItem.icon } alt="icon" />
                            { !!dataItem.iconnum && <span className={`num num${dataItem.index}`}>{ dataItem.iconnum }</span> }
                        </div>
                    )} 
                />
            </div>
        )
    }
}

module.exports = Index;