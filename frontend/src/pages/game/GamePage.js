import React from "react";
import Site from "../../components/site/Site";
import ScoreLog from "../../components/socrelog/ScoreLog";
import ServerList from "../../service/utils";
import ReadyIcon from "../../components/ready_icon/ReadyIcon";
import g1Img from "../../assets/test-bal.png";
import field from "../../assets/field.png";
import {LoadingOutlined} from "@ant-design/icons";

import './game.css'

class GamePage extends React.Component<> {
    ws = new WebSocket(ServerList['view']);

    constructor(props) {
        super(props);
        this.state = {
            site:
                [
                    {
                        "Black": 0,
                        "White": 0
                    },
                    {
                        "Black": 0,
                        "White": 0
                    },
                    {
                        "Black": 0,
                        "White": 0
                    },
                    {
                        "Black": 0,
                        "White": 0
                    },
                    {
                        "Black": 0,
                        "White": 0
                    }
                ],
            scoreLog: [],
            state: 'Prepare',  // Prepare, Game, Start, Settle
            ready: 'None'  // Black, White, None, Both
        }
        this.ws.onmessage = (m) => {
            if(m.data === "TESTING")
                return
            if (m.data.split('^')[1] === "Score") {
                this.setState({
                    scoreLog: JSON.parse(m.data.split('^')[2].replace(/'/g, '"'))
                })
            } else if (m.data.split('^')[1] === "State") {

            } else if (m.data.split('^')[1] === "Site") {
                this.setState({
                    site: JSON.parse(m.data.split('^')[2].replace(/'/g, '"'))
                })
            }
        }
    }

    render() {
        if (this.state.state === 'Prepare')
            return (
                <div className={"prepare-main d-flex flex-column justify-content-between align-content-between h-100 w-100 ready-state-" + this.state.ready}>
                    <div className="prepare-main d-flex flex-column justify-content-between align-content-between">
                        <h1 className='text-center' style={{marginTop: 30}}>Preparation Stage</h1>
                        <h3 className='text-center' style={{marginTop: 50}}><LoadingOutlined style={{marginRight: 30}} />Waiting for the command ...</h3>
                    </div>
                    <div className='d-flex flex-row justify-content-between m-4'>
                        <div>
                            <ReadyIcon teamName="The Avengers W" teamImage={g1Img} isReady={this.state.ready==='White' || this.state.ready==='Both'} side={'White'}/>
                        </div>
                        <div>
                            <img alt={"field"} src={field} className={'game-prepare-field' + (this.state.ready==='Both' ? ' game-prepare-ready' : ' game-prepare-not')}/>
                        </div>
                        <div>
                            <ReadyIcon teamName="The Avengers B" teamImage={g1Img} isReady={this.state.ready==='Black' || this.state.ready==='Both'} side={'Black'}/>
                        </div>
                    </div>
                </div>
            )
        else
            return (
                <div className="game-main" style={{width: '100%', height: '100%'}}>
                    <div className="game-site-log d-flex flex-row justify-content-around">
                        <div className="game-log d-flex">
                            <ScoreLog width={500} height={800} side={"Black"} data={this.state.scoreLog.filter(x=>x["Side"]==="Black")} />
                        </div>
                        <div className="game-sites" style={{height: 600, width: 600}}>
                            <div className="d-flex align-content-center flex-row w-100 h-100">
                                <div className="d-flex flex-column justify-content-between w-100 h-100">
                                    <Site size={180} whiteScore={this.state.site[1]["White"]} blackScore={this.state.site[1]["Black"]}/>
                                    <Site size={180} whiteScore={this.state.site[2]["White"]} blackScore={this.state.site[2]["Black"]}/>
                                </div>
                                <div className="d-flex flex-column justify-content-center w-100 h-100">
                                    <Site size={210} whiteScore={this.state.site[0]["White"]} blackScore={this.state.site[0]["Black"]}/>
                                </div>
                                <div className="d-flex flex-column justify-content-between w-100 h-100">
                                    <Site size={180} whiteScore={this.state.site[3]["White"]} blackScore={this.state.site[3]["Black"]}/>
                                    <Site size={180} whiteScore={this.state.site[4]["White"]} blackScore={this.state.site[4]["Black"]}/>
                                </div>
                            </div>
                        </div>
                        <div className="game-log d-flex">
                            <ScoreLog width={500} height={800} side={"White"} data={this.state.scoreLog.filter(x=>x["Side"]==="White")} />
                        </div>
                    </div>
                </div>
            )
    }
}

export default GamePage