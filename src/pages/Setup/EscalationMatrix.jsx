import React, { useState, useEffect, useRef } from 'react'
import AddEscalationModal from './Escalation Matrix/Modal'
import EscalationTable from './Escalation Matrix/Table';
import ExternalTable from './External Users/Table';
import Modal from './External Users/Modal';
import Details from './Internal Users/Details';

const EscalationMatrix = () => {
    const[isModalOpen,setIsModalOpen]=useState(true);
  return (
    <Details />
)
}

export default EscalationMatrix