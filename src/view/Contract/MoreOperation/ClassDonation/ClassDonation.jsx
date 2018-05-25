
// import React,{ Component } from 'react';
// import { Link } from 'react-router-dom';
import { Flex, InputItem, Button } from 'antd-mobile';

import './ClassDonation.less';
const {Component}=React

class ClassDonationModule extends Component{
	constructor(props){
		super(props);
		this.state = {
			nameData:['张三','李四','王五五'],
			classHour:80,
			currentIndex:-1
		};
	}

	handleClick(index){
		this.setState({
			currentIndex:index
		});
	};

	render(){
		const { nameData, currentIndex, classHour} = this.state;
		return(
			<div className="class-don base-css">
				<div className="title"><i></i><h3></h3></div>
				<p className="type">学员</p>
				<Flex wrap="wrap" className="single-select">
			      	{
			      		nameData.map((item,index) => {
			      			var active = currentIndex === index ? 'active' : '';
			      			return <div key={ index } onClick={ () => this.handleClick(index) } className={ active }>{ item }</div>;
			      		})
			      	}
			    </Flex>
			    <p className="type margin-t">课时</p>
			    <div className="iput">
			    	<input type="text" placeholder="请输入转赠课时" />
			    </div>
			    <p className="tip">可分配{ classHour }课时</p>
			   <Button className="btn-css">确认</Button>
			</div>
		);
	}
}

export default ClassDonationModule;