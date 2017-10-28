  import React,{Component} from "react";
  import {Button} from 'react-bootstrap';
  import PropTypes from 'prop-types';
  import {Row,Col} from 'react-bootstrap';
  class TemplateHeader extends Component{

    render(){
      return(
        <div>
          
          <Row className="show-grid">
            <Col md={2}>
              <label>New Template Title: </label>
            </Col>
            <Col md={3}>
              <input value={this.props.criteriaTitle} onChange = {(e)=>{this.props.onCriteriaChange(e.target.value)}} type = "text"></input>
            </Col>
            <Col md={3}>
              <select value={this.props.criteriaStyle}  onChange={(e)=>{this.props.onCriteriaStyleChange(e.target.value)}}>
                <option>Resistant-Based</option>
                <option>Rep-Based</option>
                <option>Mixed</option>
              </select>
            </Col>

            <Col md={2}>
              <Button style={{background: 'orange'}} onClick={this.props.onNewTemplate}>Go Back</Button>
            </Col>
          </Row>

        </div>

      )
    }
  }
  TemplateHeader.propTypes = {
    onNewTemplate: PropTypes.func.isRequired,
    onCriteriaStyleChange: PropTypes.func.isRequired,
    onCriteriaChange: PropTypes.func.isRequired,
    criteriaTitle: PropTypes.string.isRequired,
    criteriaStyle: PropTypes.string.isRequired
  }
  export default TemplateHeader;
