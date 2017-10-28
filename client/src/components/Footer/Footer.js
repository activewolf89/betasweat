  import React,{Component} from "react";
  import {Grid,Nav,Navbar,NavItem,Row,Col} from "react-bootstrap";
  import {IndexLinkContainer} from 'react-router-bootstrap';
  class Footer extends Component{
    render(){
      return(
        <Row className="show-grid">
          <Navbar  inverse style={{height:'60px'}} >

            <Col xsOffset={1} xs={2}>
              <Nav >
                <IndexLinkContainer to="/contact">
                  <NavItem eventKey={2}>Contact</NavItem>
                </IndexLinkContainer>
              </Nav>
            </Col>
          </Navbar>
        </Row>
          )
    }
  }

  export default Footer;
