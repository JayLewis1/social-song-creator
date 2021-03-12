import React, { useEffect } from 'react'
// Redux
import { connect, ConnectedProps } from "react-redux";

type Result  = {
  show: boolean
  success: boolean
  type: string
}
const mapDispatch = {
  toggleResult: (payload: Result ) => ({type: "RESULT_TOGGLE", payload})
}

const connector = connect(null, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

 const RequestResult = ({toggleResult}:Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = {
        show: false,
        success: false,
        type: ""
      }
      toggleResult(result);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toggleResult])
  return (
    <div className="request-sent-container">
      <img src="/assets/icons/result/success.svg" alt="Success"/> 
      <p>Mate request sent :)</p>
    </div>
  )
}

export default connector(RequestResult);