  import React,{Component} from "react";
  import {Grid,Button,Row,Col,ButtonToolbar} from 'react-bootstrap';
  import PropTypes from 'prop-types';
  import {Link} from 'react-router-dom';
  class CriteriaHeader extends Component{
    constructor(props){
      super(props);
      this.state = {
        sessionTemplate: this.props.criteriaTitle ? this.props.criteriaTitle:"",
        currentBodyWeight: this.props.currentBodyWeight,
        criteria: false,
        disabledStyle:{minWidth:'100px'}
      }
    }

    componentWillReceiveProps(nextProps){
      this.setState({
        criteria: nextProps.criteria,
        currentBodyWeight: nextProps.currentBodyWeight,
        sessionTemplate: nextProps.criteriaTitle
      },()=>{
        this.setState({
          disabledStyle:this.state.criteria ? {background:'darkGray',minWidth:'100px'}:{minWidth:'100px'}}

        )}

      )


    }

    render(){
      var criteriaOptions = this.props.criteriaOptions.map((criteria)=>{

        return (
          <option key={criteria._id}>{criteria.Title}</option>
        )
      })
      return(
        <form >
          <Grid>
            <Row className="show-grid">
              <Col xs={12} ><h4 style={{textAlign:'center'}}>{this.props.sessionEditObject ? "Edit Session":"New Session"}</h4></Col>
            </Row>
            <hr></hr>
            <Row className="show-grid">
              <Col smOffset={4} sm={2} xsOffset={2} xs={3}>
                <label >Template:</label>
              </Col>
              <Col sm={5} xs={2} smOffset={0} xsOffset={1}>
                <select
                  name="sessionTemplate"
                  disabled={this.state.criteria}
                  style={{maxWidth:'120px'}}
                  onChange = {(e)=>{this.props.onTemplateChange(e.target.name,e.target.value)}}
                  value={this.props.criteriaTitle}>
                  {criteriaOptions}
                </select>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col smOffset={4} sm={2} xsOffset={2} xs={3}>

                <label>Benchmarked: </label>
              </Col>
              <Col sm={5} xs={2} smOffset={0} xsOffset={1}>

                <input disabled={this.state.criteria} name="benchMark" onChange = {this.props.onBenchmarkChange} type="checkbox" checked={this.props.benchMark} value = {this.props.benchMark} ></input>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col smOffset={4} sm={2} xsOffset={2} xs={3}>


                <label > &#9651; res : </label>
              </Col>
              <Col sm={5} xs={2} smOffset={0} xsOffset={1}>

                <input style={{width:'40px'}}  type="number" disabled={this.state.criteria}  value={this.props.weight} name="weight" onChange={(e)=>{this.props.onWeightChange(e.target.name,e.target.value)}}/>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col smOffset={4} sm={2} xsOffset={2} xs={3}>

                <label >&#9651; reps: </label>
              </Col>
              <Col sm={5} xs={2} smOffset={0} xsOffset={1}>


                <input style={{width:'40px'}}  type="number" disabled={this.state.criteria}  value={this.props.reps} name="reps" onChange={(e)=>{this.props.onWeightChange(e.target.name,e.target.value)}}/>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col smOffset={4} sm={2} xsOffset={2} xs={3}>


                <label >BodyWeight: </label>
              </Col>
              <Col sm={5} xs={2} smOffset={0} xsOffset={1}>

                <input style={{width:'40px'}} disabled={this.state.criteria}  name="currentBodyWeight" onChange = {(e)=>{this.props.onWeightChange(e.target.name,e.target.value)}} type="number" value = {this.state.currentBodyWeight} ></input>
              </Col>
            </Row>

            <Row className="show-grid">
              <Col xsOffset={2} xs={10} smOffset={4} sm={8}>

                <label>ETA For Session: </label>{this.props.estimatedTime ? this.props.estimatedTime: "To Be Determined"}
              </Col>

            </Row>
            {
                            this.props.sessionEditObject &&
                              <Row className="show-grid">

                                <Col xsOffset={2} xs={10} smOffset={4} sm={8}>

                                  <label style={{marginTop:'20px'}}>Session Created On: <span style={{fontWeight:'bold'}}>{new Date(this.props.sessionEditObject.createdAt).toDateString()}</span></label>
                                </Col>

                              </Row>
            }
            <Row className="show-grid">

              { !this.state.criteria &&
                <div>

                  <Col smOffset={4} xs={11} xsOffset={1} sm={8} >
                    <ButtonToolbar>
                      <Button
                        bsStyle = "success"
                        disabled={this.props.criteriaOptions.length === 0}
                        onClick={()=>{this.props.onCriteriaSubmit(this.state.sessionTemplate,this.state.currentBodyWeight)}}>
                        Load
                      </Button>
                      <Button
                        style={{backgroundColor:'gray',color:'white'}}
                        onClick={()=>{this.props.onQuickAddTemplate()}}>
                        Add Template
                      </Button>
                      <Button
                        bsStyle = "warning"
                        onClick={()=>{this.props.onQuickAddExercise()}}>
                        Add Exercise
                      </Button>
                    </ButtonToolbar>
                  </Col>



                </div>
              }
            </Row>
            {
              this.props.sessionEditObject &&
                <Row className="show-grid" style={{marginTop:'10px', marginBottom:'10px'}}>
                  <Col smOffset={4} xs={11} xsOffset={1} sm={5} >
                    <Button
                      bsStyle="danger"
                      onClick={this.props.onRemoveSession}
                      style={{width:'100%'}}>Remove Session</Button>
                  </Col>
                </Row>
            }
            <Row className="show-grid">
              <Col xs={12}>
                <label style={{textAlign:'center'}}>{this.props.sessionMessage}</label>
              </Col>
            </Row>
          </Grid>
        </form>
      )
    }
  }
  CriteriaHeader.propTypes = {
    onCriteriaSubmit: PropTypes.func.isRequired,
    onBenchmarkChange: PropTypes.func.isRequired,
    benchMark: PropTypes.bool.isRequired,
    quickAddExercise: PropTypes.bool.isRequired,
    criteria: PropTypes.bool.isRequired,
    sessionMessage: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onWeightChange: PropTypes.func.isRequired,
    establishSubmit: PropTypes.bool.isRequired,
    onTemplateChange:PropTypes.func.isRequired,
    criteriaTitle: PropTypes.string,
    onQuickAddTemplate: PropTypes.func.isRequired,
  }

  export default CriteriaHeader;
