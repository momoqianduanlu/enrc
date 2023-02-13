export const useSearchField = () => {
  return {
    renderHistory: [
      {
        model: 'Field',
        props: {
          label: 'Project Id',
          placeholder: '请输入project id',
          modelValue: ''
        }
      },
      {
        model: 'Field',
        props: {
          label: 'Orininator',
          placeholder: '请输入Orininator',
          modelValue: ''
        }
      },
      {
        model: 'Field',
        props: {
          label: 'Trade',
          placeholder: '请输入Trade',
          modelValue: ''
        }
      },
      {
        model: 'Field',
        props: {
          type: 'textarea',
          label: 'Descriptor',
          autosize: true,
          rows: 2,
          placeholder: '请输入Descriptor',
          modelValue: ''
        }
      }
    ],
    renderNormal: [
      {
        model: 'Field',
        props: {
          label: 'Trade',
          placeholder: '请输入Trade',
          modelValue: ''
        }
      },
      {
        model: 'Field',
        props: {
          label: 'ATA',
          placeholder: '请输入ATA',
          modelValue: ''
        }
      },
      {
        model: 'Field',
        props: {
          label: 'Defect Type',
          placeholder: '请输入Defect Type',
          modelValue: ''
        }
      },
      {
        model: 'Field',
        props: {
          type: 'textarea',
          label: 'Descriptor',
          autosize: true,
          rows: 2,
          placeholder: '请输入Descriptor',
          modelValue: ''
        }
      }
    ]
  }
}

export const useFilterField = () => {
  return [
    {
      model: 'Field',
      props: {
        label: 'Project Id',
        placeholder: '请输入project id',
        modelValue: ''
      }
    },
    {
      model: 'Field',
      props: {
        label: 'AcRegNo',
        placeholder: '请输入AcRegNo',
        modelValue: '',
        disabled: true
      }
    }
  ]
}
