import React from 'react'
import LeftTopContent from './leftopcontent/LeftTopContent'
import RightTopContent from './righttopcontent/RightTopContent'
import MidTopContent from './midTopContent/MidTopContent'

const Topcontent = () => {
  return (
    <div className="Content-alignedTop grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 my-6">
      <LeftTopContent />
      <MidTopContent />
      <RightTopContent />
    </div>
  )
}

export default Topcontent
