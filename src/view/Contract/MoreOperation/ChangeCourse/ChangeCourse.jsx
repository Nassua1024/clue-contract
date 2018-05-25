
import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd-mobile';

import './ChangeCourse.less';

class ChangeCourseModule extends Component {
	constructor(props){
		super(props);
		this.state = {
			courseData:['一年级上','一年级暑','一年级寒'],
			currentIndex:-1
		};
	}

	handleClick(index){
		this.setState({
			currentIndex:index
		});
	}

	render(){
		const { courseData, currentIndex } = this.state;
		return(
			<div className="change-course base-css">
				<div className="title"><i></i><h3>缩单申请</h3></div>
				<p className="type">课程更改为</p>
				<ul className="Ul">
					{
						courseData.map((item,index) => {
							var active = currentIndex === index ? 'active' : '';
			      			return <li key={ index } onClick={ () => this.handleClick(index) } className={ active }>{ item }</li>;
						})
					}
				</ul>
				<Button className="btn-css">确认</Button>
			</div>
		);
	}
}

export default ChangeCourseModule;