import React from 'react';
import '../../styles/navigation.css';
import {Col, Nav, Row} from 'react-bootstrap';
import {MenuIcon} from '../icons/MenuIcon';
import {SwitchAccountPanel} from './components/SwitchAccoutPanel';
import {changeIsMenuOpen} from "../../actions/navigationActions";
import {useDispatch} from "react-redux";
import {useFetchUserQuery} from "../../store/auth/authApiSlice";

export function TopToolBar() {

  const dispatch = useDispatch();
  const user = useFetchUserQuery().data;

  function openMenu() {
    dispatch(changeIsMenuOpen());
  }

  return (
    <Nav className={"app-bar"}>
      {user && (
        <Col xs={2} sm={1}>
          <MenuIcon onClick={openMenu}/>
        </Col>
      )}
      {user && (
        <Col>
          <Row className="justify-content-center">
            <img
              src="./UniversityWithMeLongLogo.png"
              alt=""
              title="institute"
              className={"app-icon"}
            />
          </Row>
        </Col>
      )}
      {!user && (
        <Col>
          <img
            src="./UniversityWithMeLongLogo.png"
            alt=""
            title="institute"
            className={"app-icon"}
          />
        </Col>
      )}
      {user && (
        <Col xs={2}>
          <SwitchAccountPanel/>
        </Col>
      )}
    </Nav>
  );
}
