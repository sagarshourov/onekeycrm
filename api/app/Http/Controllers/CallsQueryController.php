<?php

namespace App\Http\Controllers;

use App\Models\Calls;
use App\Models\CallsExtra;
use App\Models\ExtraGroups;
use App\Models\ExtraValues;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\CallImport;
use App\Imports\SingleSheetImport;

use Illuminate\Support\Facades\DB;
use App\Models\AssignEmployee;
use App\Models\Package;
use App\Models\Sections;
use App\Models\Status;
use App\Models\Notifications;
use App\Models\CallHistory;


use Illuminate\Support\Facades\Http;


class CallsQueryController extends BaseController
{
    //


    protected function getCallsSection($section, $currentPage, $order, $perPage)
    {
        $user = Auth::user();

        $with = array('assigned_to', 'section', 'results', 'history', 'priorities', 'statu', 'package', 'user',  'p_sort');

        if ($section == 'null') {
            $que = Calls::whereNull('sections');
        } else {
            $que = Calls::where('sections', $section);
        }
        if ($user->is_admin == 3) {    // employee
            $que->where('assigned_to', $user->id)->Where('results', 3);
        } else if ($user->is_admin == 4) { // supervisor 
            $emp = AssignEmployee::where('admin_id', $user->id)->pluck('user_id')->toArray();;
            $emp[] = $user->id;
            $que->WhereIn('assigned_to', $emp)
                ->where(function ($q) {
                    $q->Where('results', 3);
                });
        } else { // admin and super admin
            $que->where('results', 3);
        }

        return $que->with($with)->orderBy('sort', $order)->skip(($currentPage - 1) * $perPage)->take($perPage)->get(['id', 'first_name', 'last_name', 'phone_number', 'whatsapp', 'email',  'priority', 'sections', 'follow_up_date', 'status', 'package',  'results', 'user_id',  'ag', 'age', 'f_results', 'first_contact',  'assigned_to', 'assigned_date', 'call_schedule_date', 'feedbacks',  'agreed_to_signed', 'follow_up_notes',  'first_call_notes', 'case_type', 'user_id', 'sort', 'p_sort']);
    }

    protected function getCallsSummary()
    {
    }


    protected function index($section, $currentPage, $order, $perPage)
    {


        // Open=3;
        // Notification=6;
        // No Answer=4;
        // Cancel=1;
        // Client=2;
        // Do Not Contact=5;


        $sections = Sections::pluck('id')->toArray();
        $dat = array();
        $dat[0] = $this->getCallsSection('null', $currentPage, $order, $perPage);
        foreach ($sections as $sec) {
            $dat[$sec] = $this->getCallsSection($sec, $currentPage, $order, $perPage);
            //$dat[$sec]='as';

        }

        return $this->sendResponse($dat, 'Call getting successfully.');
    }
}
