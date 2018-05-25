import React from 'react';
import {Flex, Icon} from 'antd-mobile';
import './DateSwitch.less'

class DateSwitch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            date: new Date().toLocaleDateString().replace(/\//g, '-')
        }

        // bind-this
        // this.dateChange = this.dateChange.bind(this)
    }

    dateChange(bs) {
        const {date:stateDate} = this.state
        const oneDayMS = 1000 * 60 * 60 * 24 * bs
        const date = new Date(new Date(stateDate).getTime()+oneDayMS).toLocaleDateString().replace(/\//g, '-')
        this.props.onChange(date)
        this.setState({
            date
        })
    }

    render() {
        return (
            <Flex className="dateSwitch-wrap">
                <Icon type="left" onClick={() => this.dateChange(-1)}></Icon>
                <div className="dateSwitch-time">{this.state.date}</div>
                <Icon type="right" onClick={() => this.dateChange(1)}></Icon>
            </Flex>
        )
    }
}
DateSwitch.defaultProps = {
    // onChange: () => {}
}

export default DateSwitch;