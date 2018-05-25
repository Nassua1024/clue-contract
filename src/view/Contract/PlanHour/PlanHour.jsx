
import { Picker, List, InputItem, Toast } from 'antd-mobile';
import './PlanHour.less';

const Http = Base;
const api = Base.url.Api;

class PlanHour extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			planList: [
				{ 
					hour: 0,
					list: [
						{ disabled: false, title: '老师', extra: '请选择老师', id: '', name: '', value: [], data: [] },
						{ disabled: false, title: '年级', extra: '请选择年级', id: '', name: '', value: [], data: [] },
						{ disabled: true, title: '课程', extra: '请选择课程',  id: '', name: '', value: [], data: [] }
					]
				},
			], 
			pickList: { 
				hour: 0,
				list: [
					{ disabled: false, title: '老师', extra: '请选择老师', id: '', name: '', value: [], data: [] },
					{ disabled: false, title: '年级', extra: '请选择年级', id: '', name: '', value: [], data: [] },
					{ disabled: true, title: '课程', extra: '请选择课程', id: '', name: '', value: [], data: [] }
				]
			},
			inputHour: 0, // 总输入课时
			contractCourseAllocations: [],
			btnClass: 'confirm-wrap',
		};
	}

	componentWillMount() {
		this.initTeacher();
		this.initGrade();
	}

	// 老师
	initTeacher() {

		const params = { method: 'POST' };

		Http.ajax(`${api}/selections/teachers`, params).then(res => {
			if(res && res.code == 0){
				let teacherList = res.data.teachers.map(({id: value, text: label }) => ({ value, label }));
				this.pickData(teacherList, 0);
			}
		});
	}

	// 年级
	initGrade() {

		const params = { method: 'POST' };
	
		Http.ajax(`${api}/changgui/selections/grades`, {}).then(res => {
			if(res && res.code == 0){
				let gradeList = res.data.grades.map(({id: value, name: label }) => ({ value, label }));
				this.pickData(gradeList, 1);
			}
		});
	}

	// 课程
	initCourse(gradeId, index, i) {

		const params = { data: { gradeId } };

		Http.ajax(`${api}/changgui/selections/courses`, params).then(res => {
			if(res && res.code == 0){

				let { planList } = this.state;
				let courseList = res.data.courses.map(({id: value, name: label }) => ({ value, label }));
				
				planList[index].list[2].data = [];
				planList[index].list[2].data.push(courseList);

				this.setState({ planList });
			}
		});
	}

	pickData(dataList, i) {
		
		let { pickList, planList } = this.state;

		planList.map((item) => {
			item.list[i].data = [];
			item.list[i].data.push(dataList);
		}); 

		pickList.list[i].data = [];
		pickList.list[i].data.push(dataList);

		this.setState({ pickList, planList });
	}

	// 添加规划
	add() {
		
		const { planList, pickList, inputHour } = this.state;

		if(inputHour >= this.props.totalHour) {
			Toast.info('无可规划课时数', 1);
			return false;
		}

		for(let i=0; i<planList.length; i++) {
			if(planList[i].hour == 0) {
				Toast.info('请填写规划课时数');
				return false;
			}else {
				const item = planList[i].list;
				for(let i=0; i<item.length; i++) {
					if(i%3 == 0 && item[i].id == '') {
						Toast.info('请选择老师', 1);
						return false;
					}
					if(i%3 == 1 && item[i].id == '') {
						Toast.info('请选择年级', 1);
						return false;
					}
					if(i%3 == 2 && item[i].id == '') {
						Toast.info('请选择课程', 1);
						return false;
					}
				}
			}
		}

		let listItem = JSON.parse(JSON.stringify(pickList));

		planList.push(listItem);
		this.setState({ planList });
	}

	// 删除规划
	remove(index) {
		
		const { planList } = this.state;
		
		planList.splice(index, 1);
		this.setState({ planList }, () => this.calcHour() );
	}

	onFocus() {
		this.state.planList.length >= 2 &&
		this.setState({ btnClass: 'confirm-wrap input-focus'});
	}

	// 填写规划课时数
	inputHour(e, index) {
		
		const { planList } = this.state;
		
		planList[index].hour = e.replace(/[^\d^\.]+/g,'');
		this.setState({ planList });		
	}

	// 选择老师 年级 课程
	picker(v, index, i) {

		let { planList } = this.state;

		if(i == 1) { 
			planList[index].list[2].disabled = false;
			planList[index].list[2].data = [];
			planList[index].list[2].value = [];
			planList[index].list[2].id = '';
			this.setState({ planList }, () => this.initCourse(v, index, i) );
		}

		planList[index].list[i].value = v;
		planList[index].list[i].id = v[0];
		planList[index].list[i].name = planList[index].list[i].data[0].filter(item => item.value == v)[0].label;
		
		this.setState({ planList });
	}

	// 选择课程提示
	pickCourse(index, i) {
		
		const { planList } = this.state;

		if(i == 2 && planList[index].list[i].disabled) Toast.info('请先选择年级', 1); 
	}

	// 计算填写的总课时数
	calcHour() {

		const { planList } = this.state;
		let inputHour = 0;

		planList.map(item => { inputHour += Number(item.hour); });

		if(inputHour > this.props.totalHour) Toast.info('请正确填写规划课时数', 1);
		
		this.setState({ inputHour, btnClass: 'confirm-wrap' });
	}

	// 确定
	confirm() {
		
		const { inputHour, planList } = this.state;
		let { contractCourseAllocations } = this.state;

		if(inputHour == 0) {
			Toast.info('请填写规划课时数', 1);
			return false;
		}

		if(this.props.totalHour !== inputHour) {
			Toast.info('请正确填写规划课时数', 1);
			return false;
		}

		contractCourseAllocations = [];

		for(let i=0; i<planList.length; i++) {
			
			let dataItem = {};
			const item = planList[i].list;
			
			dataItem.lessonHour = Number(planList[i].hour);

			for(let i=0; i<item.length; i++) {
				if(i%3 == 0) {
					if(item[i].id == '' || item[i].id == undefined) {
						Toast.info('请选择老师', 1);
						return false;
					} else {
						dataItem.teacherId = item[i].id; 
						dataItem.teacherName = item[i].name;
					}
				}
				if(i%3 == 1) {
					if(item[i].id == '' || item[i].id == undefined) {
						Toast.info('请选择年级', 1);
						return false;
					} else {
						dataItem.gradeName = item[i].name;
					}
				}
				if(i%3 == 2) {
					if(item[i].id == '' || item[i].id == undefined) {
						Toast.info('请选择课程', 1);
						return false;
					} else {
						dataItem.courseId = item[i].id; 
						dataItem.courseName = item[i].name; 
					}
				}
			}

			contractCourseAllocations.push(Object.assign({}, dataItem));
		}

		this.props.redirctTo(contractCourseAllocations);
	}

	render() {

		const { planList, canPickCourse, btnClass } = this.state;

		return(
			<div className={ this.props.className }>
				<div className="tip">请完成<span>{this.props.totalHour}</span>课时课程规划</div>
				{
					planList.map((item, index) => (
						<div className="plan-list" key={ index }>
							<div className="label">
								<i></i>
								<h3>规划{ index+1 }</h3>
								{
									planList.length > 1 &&
									<a href="javascript: " onClick={ () => this.remove(index) }></a>	
								}
							</div>
							<InputItem
            					type="tel"
            					placeholder="请填写规划课时数"
            					value={ item.hour == 0 ? '' : item.hour }
            					onChange={ (e) => this.inputHour(e, index) }
            					onBlur={ () => this.calcHour() }
            					onFocus={ () => this.onFocus() }
          					>
          						课时数量
          					</InputItem>
							{
								item.list.map((item, i) => (
									<Picker
	          							data={ item.data }
			          					title={ item.title }
			          					extra={ item.extra }
			          					key={ i }
			          					value={ item.value } 
			          					cascade={ false }
          								onOk={ v => this.picker(v, index, i) }
          								disabled={ item.disabled }
			        				>
	          							<List.Item 
	          								onClick={ () => this.pickCourse(index, i) } 
	          								className={ item.value == '' ? '' : 'active' } 
	          								arrow="horizontal"
	          							>
	          								{ item.title }
	          							</List.Item>
	        						</Picker>
								))
							}
						</div>
					))
				}
				<div className="add-wrap" onClick={ () => this.add() }>
					<i></i>
					<span>添加规划</span>
				</div>
				<div className={ btnClass }>
					<a href="javascript: " onClick={ () => this.confirm() } ></a>
				</div>
			</div>
		) 
	}
};

export default PlanHour;