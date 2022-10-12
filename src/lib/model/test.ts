
export interface Test {
	test:any
	result:any
}

export interface TestCase {
	name:string
	tests:Test[]
}

export interface TestSuite {
	name:string
	// method: string
	context?:any
	cases:TestCase[]
}

export interface TestCaseRequest {
	name:string
	tests:any[]
    func: (item:any, context?:any)=> any
}

export interface TestSuiteRequest {
	name:string
    context?:any
	cases: TestCaseRequest[]
}

export interface TestCaseTemplate {
	name:string
	template:string
}

export interface TestSuiteTemplate {
	template:string
	cases:TestCaseTemplate[]
}
