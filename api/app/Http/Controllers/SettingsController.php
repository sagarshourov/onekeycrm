<?php

namespace App\Http\Controllers;

use App\Models\ApplyingFor;
use App\Models\CancelReason;
use App\Models\Goal;
use App\Models\MaritalStatus;
use App\Models\Package;
use App\Models\PaymentMethod;
use App\Models\Results;
use App\Models\Sections;
use App\Models\Status;
use App\Models\Priority;
use App\Models\User;
use App\Models\WantToStudy;

use App\Models\EngTest;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingsController extends BaseController
{


    private function all_data()
    {
        $re['sections'] = Sections::orderBy('sort', 'ASC')->get(['id', 'title', 'theme', 'start_date', 'end_date', 'sort']);

        $re['cancel_reason'] = CancelReason::orderBy('sort', 'ASC')->get(['id', 'title', 'sort']);
        $re['packages'] = Package::orderBy('sort', 'ASC')->get(['id', 'title', 'value', 'sort']);
        $re['status'] = Status::orderBy('sort', 'ASC')->get(['id', 'title', 'sort']);
        $re['results'] = Results::orderBy('sort', 'ASC')->get(['id', 'title', 'sort']);
        $re['priorities'] = Priority::orderBy('sort', 'ASC')->get(['id', 'title', 'sort']);

        $re['marital_status'] = MaritalStatus::orderBy('sort', 'ASC')->get(['id', 'title', 'sort']);

        $re['want_to_study'] = WantToStudy::orderBy('sort', 'ASC')->get(['id', 'title', 'sort']);

        $re['assigned_to'] = User::where('is_admin', 3)->orderBy('sort', 'ASC')->get(['id', 'first_name', 'last_name']);

        $re['applying_for'] = ApplyingFor::orderBy('sort', 'ASC')->get(['id', 'title', 'sort']);

        $re['goal'] = Goal::orderBy('sort', 'ASC')->get(['id', 'title', 'sort']);

        $re['payment_method'] = PaymentMethod::orderBy('sort', 'ASC')->get(['id', 'title', 'sort']);

        $re['eng_test'] = EngTest::orderBy('sort', 'ASC')->get(['id', 'title', 'sort']);



        return $re;
    }



    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //




        return $this->sendResponse($this->all_data(), 'All Settings Tables Retrieve successfully.');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $input = $request->all();
        $table = $input['table'];
        unset($input['table']);
        if (isset($input['id'])) {
            $id = $input['id'];
            unset($input['id']);
            DB::table($table)
                ->where('id',  $id)
                ->update($input);
        } else {
            DB::table($table)->insert($input);
        }




        return $this->sendResponse($this->all_data(), 'Settlings tables has been changed successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $data = $request->all();

        foreach ($data as $key => $value) {
            DB::table($id)->where('id', $value)->limit(1)->update(['sort' => $key]);
        }



        //
        return $this->sendResponse($this->all_data(), $id . ' table has been reorder successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($table, $id)
    {
        //
        DB::table($table)->where('id', '=', $id)->delete();
        return $this->sendResponse($this->all_data(), "Settings tables values deleted Successfully");
    }
}
