  import React,{Component} from "react";
  import {Nav,Navbar,NavItem,Grid,Row,Col,NavDropdown,MenuItem} from "react-bootstrap";
  import {IndexLinkContainer,LinkContainer} from 'react-router-bootstrap';
  import {Link} from 'react-router-dom';
  import PropTypes from 'prop-types';
  require('./../../css/styles.css')
  class Header extends Component{
    render(){

      return(
          <Row className="show-grid">

            <Navbar inverse collapseOnSelect>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to="/"><span style={{color:'green'}}>BETA SWEAT</span></Link>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <Nav>
                  <IndexLinkContainer to="/calendar"><NavItem>Calendar</NavItem></IndexLinkContainer>
                </Nav>
                <Nav>
                  <IndexLinkContainer to="/reoccurance"><NavItem>Reoccurance</NavItem></IndexLinkContainer>
                </Nav>
                <Nav>
                  <IndexLinkContainer to="/progress"><NavItem>Progress</NavItem></IndexLinkContainer>
                </Nav>
                <Nav>
                  <IndexLinkContainer exact to="/sessions" activeClassName="active"><NavItem>Sessions </NavItem></IndexLinkContainer>
                </Nav>
                <Nav>
                  <IndexLinkContainer  to="/templates"><NavItem>Templates </NavItem></IndexLinkContainer>
                </Nav>

                <Nav>
                  <IndexLinkContainer  to="/exercises"><NavItem> Exercises</NavItem></IndexLinkContainer>
                </Nav>
                {
                                    !this.props.loggedIn &&
                                      <Nav pullRight  >
                                        <IndexLinkContainer to="/login"><NavItem >Login</NavItem></IndexLinkContainer>
                                      </Nav>
                }

                {
                                    this.props.loggedIn &&
                                      <Nav pullRight >
                                        <IndexLinkContainer to="/profile"><NavItem >Profile</NavItem></IndexLinkContainer>
                                        <NavItem onClick={this.props.logOut} >LogOut</NavItem>
                                      </Nav>
                }

              </Navbar.Collapse>
            </Navbar>
          </Row>


            )
          }
        }
        Header.propTypes = {
          loggedIn: PropTypes.bool.isRequired,
          logOut: PropTypes.func.isRequired
        }
          export default Header;
