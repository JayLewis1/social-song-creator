import React, {Fragment, useEffect} from 'react'

interface ComponentProps  {
  history: any
}

const UnAuthRedirect = ({ history }: ComponentProps) => {
  useEffect(() => {
    console.log("redirect")
    history.push("/login")
  }, [history])
  return (
    <Fragment>
      <p>Un authroized</p>
    </Fragment>
    )
}

export default UnAuthRedirect