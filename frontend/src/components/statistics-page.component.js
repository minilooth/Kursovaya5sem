import React, { Component, PureComponent } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie, PieChart, Sector, ResponsiveContainer, Bar, BarChart
  } from 'recharts';

import StatisticsService from '../services/statistics.service';
import AuthService from '../services/auth.service';
import AutodealerService from '../services/autodealer.service';

import SelectAutodealer from './select-autodealer.component';

import Utils from '../utils/utils';

import 'react-toastify/dist/ReactToastify.css';


class CustomizedLabel extends PureComponent {
    render() {
      const {
        x, y, stroke, value,
      } = this.props;

      const months = Utils.getMonths();
  
      return <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">{value}</text>;
    }
}

class CustomizedAxisTick extends PureComponent {
    render() {
      const {
        x, y, stroke, payload,
      } = this.props;

      const months = Utils.getMonths();
  
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{months[payload.value - 1]}</text>
        </g>
      );
    }
}
  

export default class StatisticsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            statistics: [],

            showSelectAutodealerModal: AutodealerService.getCurrentAutodealer() === null ? true : false,
        }
    }

    refreshStatistics() {
        if (AutodealerService.getCurrentAutodealer() == null) {
            return;
        }

        StatisticsService.get().then(
            response => {
                console.log(response);
                this.setState({
                    isLoading: false,                    
                    statistics: response.data
                });
            },
            error => {
                if (error.response.data.status === 401) {
                    AuthService.logout();
                    this.props.history.push({
                        pathname: "/login",
                        state: {
                            showToast: true,
                            toastMessage: "Сессия истекла, пожалуйста войдите в учетную запись."
                        }
                    });
                    window.location.reload();
                }
                else {
                    toast.error((error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString(), { position: toast.POSITION.BOTTOM_RIGHT });
                }
            }
        ).catch(() => {
            toast.error("Что-то пошло не так :(", { position: toast.POSITION.BOTTOM_RIGHT });
        })
    }

    componentDidMount() {
        this.refreshStatistics();
    }

    handleSelectAutodealerModalClose = () => {
        this.setState({ showSelectAutodealerModal: false })
        this.refreshStatistics();
    }

    onSelectAutodealerModalCancel = () => {
        this.props.history.push("/profile");
        window.location.reload();
    }

    countOfCarsSoldLineChartTooltip = ({ active, payload, label }) => {
        if (active) {
            const months = Utils.getMonths();
    
            return (
                <div style={{border: "1px solid " + payload[0].color, backgroundColor: "white", padding: "10px"}}>
                <p style={{margin: "0", padding: "0", color: payload[0].color}}>{months[label - 1]}</p>
                <p style={{margin: "0", padding: "0", color: payload[0].color}}>Количество проданных автомобилей: {payload[0].value}</p>
                </div>
            );
        }
      
        return null;
    };

    countOfClientsLineChartTooltip = ({ active, payload, label }) => {
        if (active) {
            const months = Utils.getMonths();
    
            return (
                <div style={{border: "1px solid " + payload[0].color, backgroundColor: "white", padding: "10px"}}>
                <p style={{margin: "0", padding: "0", color: payload[0].color}}>{months[label - 1]}</p>
                <p style={{margin: "0", padding: "0", color: payload[0].color}}>Количество клиентов: {payload[0].value}</p>
                </div>
            );
        }
      
        return null;
    };

    totalSalesLineChartTooltip = ({ active, payload, label }) => {
        if (active) {
            const months = Utils.getMonths();
    
            return (
                <div style={{border: "1px solid " + payload[0].color, backgroundColor: "white", padding: "10px"}}>
                <p style={{margin: "0", padding: "0", color: payload[0].color}}>{months[label - 1]}</p>
                <p style={{margin: "0", padding: "0", color: payload[0].color}}>Продажи: {payload[0].value} р.</p>
                </div>
            );
        }
      
        return null;
    };

    countOfCarsSoldPieChartTooltip = ({ active, payload, label }) => {
        if (active) {
            const months = Utils.getMonths();
    
            return (
            <div style={{border: "1px solid " + payload[0].color, backgroundColor: "white", padding: "10px"}}>
                <p style={{margin: "0", padding: "0", color: payload[0].color}}>{months[payload[0].payload.payload.month - 1]}</p>
                <p style={{margin: "0", padding: "0", color: payload[0].color}}>Количество проданных автомобилей: {payload[0].value}</p>
            </div>
            );
        }
    
        return null;
    };

    render() {
        let stats = null;

        if (!this.state.isLoading) {
            stats =
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <div>
                            <LineChart
                                width={500}
                                height={400}
                                data={this.state.statistics}
                                margin={{
                                top: 20, right: 30, left: 20, bottom: 20,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" height={60} tick={<CustomizedAxisTick/>} />
                                <YAxis/>
                                <Tooltip content={this.countOfCarsSoldLineChartTooltip} />
                                <Legend />
                                <Line type="monotone" dataKey="countOfCarsSold" stroke="#8884d8" name="Количество проданных автомобилей" activeDot={{ r: 8 }} label={<CustomizedLabel/>}/>
                            </LineChart>
                        </div>
                        <div>
                            <BarChart
                                width={500}
                                height={400}
                                data={this.state.statistics}
                                margin={{
                                top: 20, right: 30, left: 20, bottom: 20,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" height={60} tick={<CustomizedAxisTick/>} />
                                <YAxis />
                                <Tooltip content={this.countOfClientsLineChartTooltip}/>
                                <Legend />
                                <Bar dataKey="countOfCarsSold" name="Количество проданных автомобилей" fill="#8884d8" label={<CustomizedLabel/>} />
                            </BarChart>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <div>
                            <LineChart
                                width={500}
                                height={400}
                                data={this.state.statistics}
                                margin={{
                                top: 20, right: 30, left: 20, bottom: 20,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" height={60} tick={<CustomizedAxisTick/>} />
                                <YAxis/>
                                <Tooltip content={this.countOfClientsLineChartTooltip} />
                                <Legend />
                                <Line type="monotone" dataKey="countOfClients" stroke="#8884d8" name="Количество клиентов" activeDot={{ r: 8 }} label={<CustomizedLabel/>}/>
                            </LineChart>
                        </div>
                        <div>
                            <BarChart
                                width={500}
                                height={400}
                                data={this.state.statistics}
                                margin={{
                                top: 20, right: 30, left: 20, bottom: 20,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" height={60} tick={<CustomizedAxisTick/>} />
                                <YAxis />
                                <Tooltip content={this.countOfClientsLineChartTooltip}/>
                                <Legend />
                                <Bar dataKey="countOfClients" name="Количество клиентов" fill="#8884d8" label={<CustomizedLabel/>} />
                            </BarChart>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <div>
                            <LineChart
                                width={500}
                                height={400}
                                data={this.state.statistics}
                                margin={{
                                top: 20, right: 30, left: 20, bottom: 20,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" height={60} tick={<CustomizedAxisTick/>} />
                                <YAxis/>
                                <Tooltip content={this.totalSalesLineChartTooltip} />
                                <Legend />
                                <Line type="monotone" dataKey="totalSales" stroke="#8884d8" name="Продажи" activeDot={{ r: 8 }} label={<CustomizedLabel/>}/>
                            </LineChart>
                        </div>
                        <div>
                            <BarChart
                                width={500}
                                height={400}
                                data={this.state.statistics}
                                margin={{
                                top: 20, right: 30, left: 20, bottom: 20,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" height={60} tick={<CustomizedAxisTick/>} />
                                <YAxis />
                                <Tooltip content={this.countOfClientsLineChartTooltip}/>
                                <Legend />
                                <Bar dataKey="totalSales" name="Продажи" fill="#8884d8" label={<CustomizedLabel/>} />
                            </BarChart>
                        </div>
                    </div>
                </div>
        }
        else {
            stats = 
                <div style={{display: "flex", justifyContent: "center", width: "100%", paddingTop: "100px"}}> 
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Загрузка...</span>
                    </Spinner>
                    &nbsp;
                    <div>
                        <div style={{fontSize: "24px"}}>Загрузка...</div>
                    </div>
                </div>
        }

        return(
            <Container style={{margin: "100px auto", width: "80%"}} fluid>
                <div style={{fontSize: "32px", fontWeight: "bold"}}><FontAwesomeIcon icon={faChartBar}/>&nbsp;Статистика текущего автосалона</div>
                {stats}
                <ToastContainer limit={3}/>
                <SelectAutodealer 
                    prevProps={this.props}
                    show={this.state.showSelectAutodealerModal}
                    onHide={this.handleSelectAutodealerModalClose} 
                    onCancel={this.onSelectAutodealerModalCancel}/>
            </Container>
        )
    }
}