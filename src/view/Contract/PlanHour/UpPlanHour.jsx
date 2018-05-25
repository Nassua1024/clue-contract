
import NewPlanHour from './PlanHour';
const Http = Base;
const api = Base.url.Api;

class UpPlanHour extends React.Component {

	redirctTo(data) {
		
		const params = this.props.params;
		params.data.contractCourseAllocations = data;
		
		Http.ajax(`${api}/changgui/contracts/upgrade`, params).then(res => {
            if(res.code == 0){
                localStorage.setItem('up',JSON.stringify(res.data));
                this.props.redirctTo();
            }
        });		
	}

	render() {
		return(
			<NewPlanHour 
				className={ this.props.className } 
				totalHour={ this.props.totalHour }
				redirctTo={ (data) => this.redirctTo(data) } 
				initOldPlanHour={ () => this.initOldPlanHour() }
				contractId={ this.props.contractId }
			/>
		)
	}
};

export default UpPlanHour;