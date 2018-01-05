import * as strings from 'ColumnFormatterWebPartStrings';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { Position } from 'office-ui-fabric-react/lib/utilities/positioning';
import * as React from 'react';

import { columnTypes, IDataColumn } from '../../state/State';
import styles from '../ColumnFormatter.module.scss';
import { conditionalValues, IConditionalValue, IWizard, standardWizardStartingColumns } from './WizardCommon';

import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

/*
Wizard Tab Rendering
*/

export interface IWizardSeverityPanelProps {
	showValue: boolean;
	showIcon: boolean;
	goodValue: string;
	lowValue: string;
	warningValue: string;
	severeWarningValue: string;
	blockedValue: string;
	updateValues:(showValue:boolean, showIcon:boolean, levels:Array<ISeverityLevel>, defaultClass:string, defaultIcon:string) => void;
}

export interface IWizardSeverityPanelState {
	showValue: boolean;
	showIcon: boolean;
	goodValue: string;
	lowValue: string;
	warningValue: string;
	severeWarningValue: string;
	blockedValue: string;
	defaultSeverity: string;
}

export class WizardSeverityPanel extends React.Component<IWizardSeverityPanelProps, IWizardSeverityPanelState> {
	
	public constructor(props:IWizardSeverityPanelProps){
		super(props);

		this.state = {
			showValue: props.showValue,
			showIcon: props.showIcon,
			goodValue: props.goodValue,
			lowValue: props.lowValue,
			warningValue: props.warningValue,
			severeWarningValue: props.severeWarningValue,
			blockedValue: props.blockedValue,
			defaultSeverity: 'blocked'
		};
	}

	public render(): React.ReactElement<IWizardSeverityPanelProps> {
		return (
			<div>
				<span className={styles.wizardGroupLabel}>{strings.WizardSeverityGroupValues}</span>
				<TextField
				 label={strings.WizardSeverityGoodLabel + ':'}
				 value={this.state.goodValue}
				 iconProps={{iconName:'CheckMark'}}
				 onChanged={this.onGoodValueChanged}
				 disabled={this.state.defaultSeverity=='good'}/>
				<TextField
				 label={strings.WizardSeverityLowLabel + ':'}
				 value={this.state.lowValue}
				 iconProps={{iconName:'Forward'}}
				 onChanged={this.onLowValueChanged}
				 disabled={this.state.defaultSeverity=='low'}/>
				<TextField
				 label={strings.WizardSeverityWarningLabel + ':'}
				 value={this.state.warningValue}
				 iconProps={{iconName:'Error'}}
				 onChanged={this.onWarningValueChanged}
				 disabled={this.state.defaultSeverity=='warning'}/>
				<TextField
				 label={strings.WizardSeveritySevereWarningLabel + ':'}
				 value={this.state.severeWarningValue}
				 iconProps={{iconName:'Warning'}}
				 onChanged={this.onSevereWarningValueChanged}
				 disabled={this.state.defaultSeverity=='severeWarning'}/>
				<TextField
				 label={strings.WizardSeverityBlockedLabel + ':'}
				 value={this.state.blockedValue}
				 iconProps={{iconName:'ErrorBadge'}}
				 onChanged={this.onBlockedValueChanged}
				 disabled={this.state.defaultSeverity=='blocked'}/>

				<Dropdown
				 label={strings.WizardSeverityDefaultSeverityLabel + ':'}
				 selectedKey={this.state.defaultSeverity}
				 options={[
					 { key: 'good', text: strings.WizardSeverityGoodLabel },
					 { key: 'low', text: strings.WizardSeverityLowLabel },
					 { key: 'warning', text: strings.WizardSeverityWarningLabel },
					 { key: 'severeWarning', text: strings.WizardSeveritySevereWarningLabel },
					 { key: 'blocked', text: strings.WizardSeverityBlockedLabel}
				 ]}
				 onChanged={this.onDefaultSeverityChanged}/>

				<span className={styles.wizardGroupLabel}>{strings.WizardSeverityGroupDisplay}</span>
				<Toggle
				 checked={this.state.showValue}
				 onChanged={this.onShowValueChanged}
				 onText={strings.WizardSeverityValueVisible}
				 offText={strings.WizardSeverityValueHidden}/>
				<Toggle
				 checked={this.state.showIcon}
				 onChanged={this.onShowIconChanged}
				 onText={strings.WizardSeverityIconVisible}
				 offText={strings.WizardSeverityIconHidden}/>
			</div>
		);
	}

	@autobind
	private onGoodValueChanged(text: string) {
		this.setState({
			goodValue: text
		});
		this.calculateValues(this.state.showValue, this.state.showIcon, this.state.defaultSeverity, text, this.state.lowValue, this.state.warningValue, this.state.severeWarningValue, this.state.blockedValue);
	}

	@autobind
	private onLowValueChanged(text: string) {
		this.setState({
			lowValue: text
		});
		this.calculateValues(this.state.showValue, this.state.showIcon, this.state.defaultSeverity, this.state.goodValue, text, this.state.warningValue, this.state.severeWarningValue, this.state.blockedValue);
	}

	@autobind
	private onWarningValueChanged(text: string) {
		this.setState({
			warningValue: text
		});
		this.calculateValues(this.state.showValue, this.state.showIcon, this.state.defaultSeverity, this.state.goodValue, this.state.lowValue, text, this.state.severeWarningValue, this.state.blockedValue);
	}

	@autobind
	private onSevereWarningValueChanged(text: string) {
		this.setState({
			severeWarningValue: text
		});
		this.calculateValues(this.state.showValue, this.state.showIcon, this.state.defaultSeverity, this.state.goodValue, this.state.lowValue, this.state.warningValue, text, this.state.blockedValue);
	}

	@autobind
	private onBlockedValueChanged(text: string) {
		this.setState({
			blockedValue: text
		});
		this.calculateValues(this.state.showValue, this.state.showIcon, this.state.defaultSeverity, this.state.goodValue, this.state.lowValue, this.state.warningValue, this.state.severeWarningValue, text);
	}

	@autobind
	public onDefaultSeverityChanged(item: IDropdownOption) {
		this.setState({
			defaultSeverity: item.key.toString()
		});
		this.calculateValues(this.state.showValue, this.state.showIcon, item.key.toString(), this.state.goodValue, this.state.lowValue, this.state.warningValue, this.state.severeWarningValue, this.state.blockedValue);
	}

	@autobind
	private onShowValueChanged(checked: boolean): void {
		this.setState({ 
			showValue: checked!
		});
		this.calculateValues(checked!, this.state.showIcon, this.state.defaultSeverity, this.state.goodValue, this.state.lowValue, this.state.warningValue, this.state.severeWarningValue, this.state.blockedValue);
	}

	@autobind
	private onShowIconChanged(checked: boolean): void {
		this.setState({ 
			showIcon: checked!
		});
		this.calculateValues(this.state.showValue, checked!, this.state.defaultSeverity, this.state.goodValue, this.state.lowValue, this.state.warningValue, this.state.severeWarningValue, this.state.blockedValue);
	}

	private calculateValues(showValue:boolean, showIcon:boolean, defaultSeverity:string, goodValue:string, lowValue:string, warningValue:string, severeWarningValue:string, blockedValue:string){
		let levels:Array<ISeverityLevel> = new Array<ISeverityLevel>();
		let defaultClass:string;
		let defaultIcon:string;

		let goodLevel:ISeverityLevel = {
			value: goodValue,
			class: 'sp-field-severity--good',
			icon: 'CheckMark'
		};
		let lowLevel:ISeverityLevel = {
			value: lowValue,
			class: 'sp-field-severity--low',
			icon: 'Forward'
		};
		let warningLevel:ISeverityLevel = {
			value: warningValue,
			class: 'sp-field-severity--warning',
			icon: 'Error'
		};
		let severeWarningLevel:ISeverityLevel = {
			value: severeWarningValue,
			class: 'sp-field-severity--severeWarning',
			icon: 'Warning'
		};
		let blockedLevel:ISeverityLevel = {
			value: blockedValue,
			class: 'sp-field-severity--blocked',
			icon: 'ErrorBadge'
		};

		switch (defaultSeverity) {
			case 'good':
				defaultClass = goodLevel.class;
				defaultIcon = goodLevel.icon;
				break;
			case 'low':
				defaultClass = lowLevel.class;
				defaultIcon = lowLevel.icon;
				break;
			case 'warning':
				defaultClass = warningLevel.class;
				defaultIcon = warningLevel.icon;
				break;
			case 'severeWarning':
				defaultClass = severeWarningLevel.class;
				defaultIcon = severeWarningLevel.icon;
				break;
			case 'blocked':
				defaultClass = blockedLevel.class;
				defaultIcon = blockedLevel.icon;
				break;
		}

		if(defaultSeverity !== 'good') {
			levels.push(goodLevel);
		}
		if(defaultSeverity !== 'low') {
			levels.push(lowLevel);
		}
		if(defaultSeverity !== 'warning') {
			levels.push(warningLevel);
		}
		if(defaultSeverity !== 'severeWarning') {
			levels.push(severeWarningLevel);
		}
		if(defaultSeverity !== 'blocked') {
			levels.push(blockedLevel);
		}

		this.props.updateValues(showValue, showIcon, levels, defaultClass, defaultIcon);
	}
	
}


/*
	Wizard Definition
*/

export interface ISeverityLevel {
	value: string;
	class: string;
	icon: string;
}

const calculateCode = (colType:columnTypes, showValue:boolean, showIcon:boolean, levels:Array<ISeverityLevel>, defaultClass:string, defaultIcon:string): string => {
	let currentField:string = '@currentField';
	let ensureString:boolean = false;
	if(colType == columnTypes.lookup) {
		currentField = '@currentField.lookupValue';
		ensureString = true;
	}
	
	let classLogic: Array<string> = [
		'  "attributes": {',
		'    "class": {'
	];


	let logic: Array<string> = [
		'  "attributes": {',
		conditionalValues('class', '    ', levels.map((value:ISeverityLevel):IConditionalValue => {
			return {
				compareTo: value.value,
				result: value.class
			};
		}), defaultClass, currentField, ensureString),
		'  }' + (showIcon || showValue ? ',' : '') 
	];
	if(showIcon || showValue) {
		logic.push('  "children": [');

		if(showIcon) {
			logic.push(...[
				'    {',
				'      "elmType": "span",',
				'      "style": {',
				'        "display": "inline-block",',
				'        "padding-left": "4px"',
				'      },',
				'      "attributes": {',
				conditionalValues('iconName', '        ', levels.map((value:ISeverityLevel):IConditionalValue => {
					return {
						compareTo: value.value,
						result: value.icon
					};
				}), defaultIcon, currentField, ensureString),
				'      }',
				'    }' + (showValue ? ',' : '') 
			]);
		}

		if(showValue) {
			logic.push(...[
				'    {',
				'      "elmType": "span",',
				'      "txtContent": "' + currentField + '",',
				'      "style": {',
				'        "padding-left": "4px"',
				'      }',
				'    }',
			]);
		}

		logic.push('  ]');
	}

	return [
		'{',
		'  "$schema": "http://columnformatting.sharepointpnp.com/columnFormattingSchema.json",',
		'  "debugMode": true,',
		'  "elmType": "div",',
		...logic,
		'}'
	].join('\n');
};


export const WizardSeverity: IWizard = {
	name: strings.WizardSeverityName,
	description: strings.WizardSeverityDescription,
	iconName: 'Info',
	fieldTypes: [
		columnTypes.text,
		columnTypes.choice,
		columnTypes.lookup,
		columnTypes.number
	],
	isTemplate: false,
	startingColumns: (colType:columnTypes): Array<IDataColumn> => {return standardWizardStartingColumns(colType);},
	startingRows: (colType:columnTypes): Array<Array<any>> => {
		if(colType == columnTypes.lookup) {
			return [
				[{lookupId:1, lookupValue: strings.WizardSeverityGood}],
				[{lookupId:2, lookupValue: strings.WizardSeverityLow}],
				[{lookupId:3, lookupValue: strings.WizardSeverityWarning}],
				[{lookupId:4, lookupValue: strings.WizardSeveritySevereWarning}],
				[{lookupId:5, lookupValue: strings.WizardSeverityBlocked}],
				[{lookupId:6, lookupValue: strings.WizardSeverityOther}]
			];
		}
		return [
			[strings.WizardSeverityGood],
			[strings.WizardSeverityLow],
			[strings.WizardSeverityWarning],
			[strings.WizardSeveritySevereWarning],
			[strings.WizardSeverityBlocked],
			[strings.WizardSeverityOther]
		];
	},
	startingCode: (colType:columnTypes): string => {
		return calculateCode(colType, true, true, [
			{
				value: strings.WizardSeverityGood,
				class: 'sp-field-severity--good',
				icon: 'CheckMark'
			},
			{
				value: strings.WizardSeverityLow,
				class: 'sp-field-severity--low',
				icon: 'Forward'
			},
			{
				value: strings.WizardSeverityWarning,
				class: 'sp-field-severity--warning',
				icon: 'Error'
			},
			{
				value: strings.WizardSeveritySevereWarning,
				class: 'sp-field-severity--severeWarning',
				icon: 'Warning'
			}
		], 'sp-field-severity--blocked', 'ErrorBadge');
	},
	onWizardRender: (updateEditorString:(editorString:string) => void, colType:columnTypes): JSX.Element => {
		return (
			<WizardSeverityPanel
			 showValue={true}
			 showIcon={true}
			 goodValue={strings.WizardSeverityGood}
			 lowValue={strings.WizardSeverityLow}
			 warningValue={strings.WizardSeverityWarning}
			 severeWarningValue={strings.WizardSeveritySevereWarning}
			 blockedValue={strings.WizardSeverityBlocked}
			 updateValues={(showValue:boolean, showIcon:boolean, levels:Array<ISeverityLevel>, defaultClass:string, defaultIcon:string) => {
				updateEditorString(calculateCode(colType, showValue, showIcon, levels, defaultClass, defaultIcon));
			 }}/>
		);
	}
};