/**/
/* 
	 * FILE DESCRIPTION: 
	 * A standard app.js file made by the create-react-app command.
*/
/**/
import React from "react"
import PlayWithAIComponent from "./components/play With AI/PlayWithAIComponent.js"


 /**/
/*
NAME : GameBoard.App() - Puts the play with AI component in the web app.

SYNOPSIS : App()

DESCRIPTION 
			Puts the play with AI component in the web app.

RETURNS : A jsx div object containing the PlayWithAIComponent.

AUTHOR : Srijan Prasad Joshi

DATE : 06/26/2020

*/
/**/
function App() {
	return (
		<div>
			<PlayWithAIComponent/>
		</div>
	)
}
/* App() */

export default App
