import React, {Component} from 'react';
import {Row, Grid, Col, Button} from 'react-bootstrap';
import axios from 'axios';
import {BootstrapTable, TableHeaderColumn, DeleteButton, InsertButton} from 'react-bootstrap-table';
import { withNamespaces } from 'react-i18next';
import { Trans } from 'react-i18next';
import {Link} from "react-router-dom";
import {NotificationManager} from "react-notifications";

class Buildings extends Component {
    constructor(props) {
        super();
        this.state = {
            buildings: [],
            deleteText: <Trans>Delete</Trans>
        }
    };

    componentDidMount() {
        axios.get("http://localhost:8080/building/all",{
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }).then(response => {
            console.log(response);
            const newBuildings = response.data.map(e => {
                return {
                    id: e.id,
                    number: e.number
                };
            });
            const newState = Object.assign({}, this.state, {
                buildings: newBuildings
            })
            this.setState(newState);
        }).catch(error => console.log(error))
    }

    handleDeleteButtonClick = (rowKeys) => {
        axios.delete("http://localhost:8080/building/" + rowKeys, {
            headers: {
                "Authorization": localStorage.getItem('token')
            }
        } ).then(response =>{
            NotificationManager.success("Building deleted");
        }).catch(error => {
            console.log(error);
            NotificationManager.error("Could not delete buidling");
        })

    }

    createCustomDeleteButton = (onClick) => {
        var text = this.state.deleteText
        return (
            <DeleteButton
                btnText= {text}
                btnContextual='btn-warning'/>
        );
    }


    createCustomInsertButton = (onClick) => {
        var text = this.state.insertText;
        return (
            <Link to={{
                pathname: "/buildingCreate"
            }}>
                <InsertButton
                    btnText={text}
                    btnContextual='btn-success'
                />
            </Link>
        );
    }

    buttonFormatter(cell, row){
        return <Link to={{
            pathname: "/premises",
            state: {
                id: row.id,
                building: true
            }

        }}><Button><Trans>Premises</Trans></Button></Link>
    }


    selectRowProp = {
        mode: 'radio'
    };

    render() {

        const options = {
            deleteBtn: this.createCustomDeleteButton,
            afterDeleteRow: this.handleDeleteButtonClick,
            insertBtn: this.createCustomInsertButton
        };

        return (
            <Grid>
                <Row>
                    <Col lg={3}></Col>
                    <Col lg={6}>
                        <BootstrapTable data={this.state.buildings} insertRow={true}
                                        search={true} selectRow={this.selectRowProp} pagination={true}  options={options} deleteRow>
                            <TableHeaderColumn hidden={true} autoValue={true} dataField='id' isKey>Id</TableHeaderColumn>
                            <TableHeaderColumn dataField='number'>Number</TableHeaderColumn>
                            <TableHeaderColumn dataFormat={this.buttonFormatter}><Trans>Premises</Trans></TableHeaderColumn>
                        </BootstrapTable>

                    </Col>
                    <Col lg={3}></Col>
                </Row>
            </Grid>
        )
    }
}

export default withNamespaces()(Buildings);