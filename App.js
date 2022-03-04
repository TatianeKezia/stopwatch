import React, { Component } from 'react'
import { StyleSheet,Text,View,ScrollView, TouchableOpacity } from 'react-native'

//instalar a bilbioteca moment - react-native install moment
import moment from 'moment'


//Função o componente timer
function Timer ({ interval, style }){
    const pad = (n) => n < 10 ? '0' + n : n
    const duration = moment.duration(interval)

    //Dividir os milessegundos por 10 e especificar o número de casas decimais
    const centiseconds = Math.floor(duration.milliseconds()/10)

    return (
        <View style = {styles.timerContainer}>
            <Text style = {style}>{pad(duration.minutes())}:</Text>
            <Text style = {style}>{pad(duration.seconds())},</Text>
            <Text style = {style}>{pad(centiseconds)}</Text>
        </View>
    )
}

//Funçao para o componente Botão
function RoundButton({ title,color,background,onPress,disabled }){
    return(
        <TouchableOpacity onPress={() => ! disabled && onPress()}
            style = {[styles.button, {backgroundColor: background}]}
            activeOpacity = {disabled ? 1.0 : 0.7}
        >
            <View style = { styles.buttonBorder }>
                <Text style = {[styles.buttonTitle,{ color }]} >{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

//Função para fazer o componente horizontal dos buttons
function ButtonsRow ({children}){
    return(
        <View style = {styles.buttonsRow}>{children}</View>
    )
}

//Função para marcação de Volta
function Lap ({ number,interval,fastest,slowest }){
    const lapStyle = [styles.lapText, fastest && styles.fastest, slowest && styles.slowest, ]
    return(
        <View style = {styles.lap}>
            <Text style = {lapStyle}>Volta {number}</Text>
            <Timer style = {[lapStyle, styles.lapTimer]}
            interval = {interval} />
        </View>
    )
}

//Função para a Tabela de Voltas
function LapsTable ({ laps,timer }){
    const finishedLaps = laps.slice(1)
    //Number.MAX_SAFE_INTEGER - método nativo Js para maior inteiro seguro
    let min = Number.MAX_SAFE_INTEGER
    //Number.MIN_SAFE_INTEGER - método nativo Js para menor inteiro seguro
    let max = Number.MIN_SAFE_INTEGER
    if (finishedLaps.length >= 2){
        finishedLaps.forEach(lap => {
            if (lap < min) min = lap
            if (lap > max) max = lap
        })
    }



    return (

        <ScrollView style = {styles.scrollView}>
            {laps.map((lap,index) => (
                <Lap number = { laps.length - index}
                    key= {laps.length - index}
                    interval ={index === 0 ? timer + lap: lap}
                    slowest = { lap === max}
                    fastest = { lap === min}
                />
            ))}
        </ScrollView>
    )
}


export default class App extends Component {

    constructor(props) {

        super(props)

        this.state = {

            start: 0,
            now:0,
            laps: [],
        }
    }

    //limpar o intervalo de tempo armazenado da aplicação
    componentWillUnmount () {

        clearInterval (this.timer)
    }

    start = () => {

        const now = new Date().getTime()

        this.setState({

            start: now,
            now,
            laps:[0],

        })
        this.timer = setInterval (() => {

            this.setState ({ now: new Date().getTime() })

        },100)

    }

    lap = () => {

        const timestamp = new Date().getTime()

        const { laps,now,start } = this.state

        const [firstLap, ...other] = laps

        this.setState ({

            laps: [0,firstLap + now - start, ...other],
            start: timestamp,
            now: timestamp,

        })

    }

    stop =() => {

        clearInterval(this.timer)

        const { laps,now,start } = this.state

        const [firstLap, ...other] =laps

        this.setState ({

            laps: [firstLap + now - start, ...other],
            start: 0,
            now: 0,

        })
    }


    reset = () => {

        this.setState({

            laps:[],
            start: 0,
            now: 0,

        })
    }

    resume = () => {

        const now = new Date().getTime()

        this.setState({

            start: now,
            now,

        })

        this.timer = setInterval(() => {

            this.setState({now: new Date().getTime()})

        },100)

    }

   
   render(){

       const { now,start,laps} = this.state
        const timer = now - start

       return(

           <View style = {styles.container}>
           <Timer 
                interval = {laps.reduce((total,curr) => total + curr, 0) + timer}
                style = {styles.time}
            />
            
            {laps.length === 0 && (
               <ButtonsRow>
                    <RoundButton
                        title = 'Voltar'
                        color = '#8B8B90'
                        background = '#232323'
                        disabled
                    />
                    <RoundButton
                        title = 'Iniciar'
                        color = '#50D167'
                        background = '#1B361F'
                        onPress = {this.start}
                    />
                </ButtonsRow>
           )}

            {start > 0 && (
                <ButtonsRow>
                    <RoundButton
                        title = 'Voltar'
                        color = '#FFFFFF'
                        background = '#3D3D3D'
                        onPress = {this.lap}
                    />
                    <RoundButton
                        title = 'Parar'
                        color = '#E33935'
                        background = '#3C1715'
                        onPress = {this.stop}
                    />
                </ButtonsRow>
           )}

             {laps.length > 0 && start === 0 &&(
                <ButtonsRow>
                    <RoundButton
                        title = 'Reset'
                        color = '#FFFFFF'
                        background = '#3D3D3D'
                        onPress={this.reset}
                    />
                    <RoundButton 
                        title = 'Iniciar'
                        color = '#50D167'
                        background = '#1B361F'
                        onPress = {this.resume}
                    />
                </ButtonsRow>
           )}

            <LapsTable laps={laps} timer ={timer}/>

        </View>            

       );
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        alignItems:'center',
        paddingTop: 130,
        paddingHorizontal:20,
    },
    time: {
        color: '#FFFFFF',
        fontSize: 76,
        fontWeight: '200',
        width: 110,
    },
    button:{
        width:80,
        height:80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTitle: {
        fontSize: 18,
    },
    buttonBorder: {
        width:76,
        height: 76,
        borderRadius:38,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsRow: {
        flexDirection: 'row',
        alignSelf:'stretch',
        justifyContent: 'space-between',
        marginTop:80,
        marginBottom:30, 
    },
    lapText: {
        color:'#FFFFFF',
        fontSize: 18,
    },
    lapTimer: {
        width:30,
    },
    lap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#151515',
        borderTopWidth: 1,
        paddingVertical:10,
    },
    scrollView: {
        alignSelf: 'stretch',
    },
    fastest: {
        color: '#4BC0F',
    },
    slowest: {
        color:'#CC3531'
    },
    timerContainer: {
        flexDirection: 'row',
    }
})