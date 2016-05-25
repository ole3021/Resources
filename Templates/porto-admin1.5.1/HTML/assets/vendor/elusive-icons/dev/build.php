<?php



    function cleanIcon( $icon ) {
        global $iconData;
        $icon['name'] = ucwords( str_replace( '-', ' ', $icon['name'] ) );

        // Filters
        $filter_parts   = explode( '-', $icon['id'] );
        $icon['filter'] = $filter_parts;
        if ( ! in_array( $icon['name'], $icon['filter'] ) ) {
            $icon['filter'][] = $icon['name'];
        }
        if ( ! in_array( $icon['id'], $icon['filter'] ) ) {
            $icon['filter'][] = $icon['id'];
        }
        $icon['filter'][] = $icon['name'];
        $icon['filter']   = array_unique( $icon['filter'] );

        if ( isset( $iconData[ $icon['id'] ] ) ) {
            // Filters
            if ( isset( $iconData[ $icon['id'] ]['filters'] ) && ! empty( $iconData[ $icon['id'] ]['alias'] ) ) {
                if ( ! is_array( $iconData[ $icon['id'] ]['filters'] ) ) {
                    $iconData[ $icon['id'] ]['filters'] = array( $iconData[ $icon['id'] ]['filters'] );
                }
                foreach ( $iconData[ $icon['id'] ]['filters'] as $filter ) {
                    $icon['filter'][] = $filter;
                }
                $icon['filter'] = array_unique( $icon['filter'] );
            }

            // Alias
            if ( isset( $iconData[ $icon['id'] ]['alias'] ) && ! empty( $iconData[ $icon['id'] ]['alias'] ) ) {
                if ( ! is_array( $iconData[ $icon['id'] ]['alias'] ) ) {
                    $iconData[ $icon['id'] ]['alias'] = array( $iconData[ $icon['id'] ]['alias'] );
                }
                $icon['alias'] = $iconData[ $icon['id'] ]['alias'];
                $icon['alias'] = array_unique( $icon['alias'] );
            }
            // Categories
            if ( isset( $iconData[ $icon['id'] ]['categories'] ) && ! empty( $iconData[ $icon['id'] ]['categories'] ) ) {
                if ( ! is_array( $iconData[ $icon['id'] ]['categories'] ) ) {
                    $iconData[ $icon['id'] ]['categories'] = array( $iconData[ $icon['id'] ]['categories'] );
                }
                $icon['categories'] = $iconData[ $icon['id'] ]['categories'];
                $icon['categories'] = array_unique( $icon['categories'] );
            }
            // Created
            if ( isset( $iconData[ $icon['id'] ]['created'] ) && ! empty( $iconData[ $icon['id'] ]['created'] ) ) {
                $icon['created'] = $iconData[ $icon['id'] ]['created'];
            } else {
                $icon['created'] = "1.0";
            }
        }

        if ( ! isset( $icon['categories'] ) || empty( $icon['categories'] ) ) {
            $icon['categories'] = array( "Unsorted" );
        }

        return $icon;

    }

    $icons = json_decode( file_get_contents( dirname( __FILE__ ) . '/elusiveicons.css' ), true );

    // Include the various filters, categories, and alias keys
    include( 'icon_data.php' );

    if ( isset( $_GET['filter_array'] ) ) {
        $newIconData = array();
        foreach ( $icons as $icon => $unicode ) {

            if ( isset( $iconData[ $icon ] ) && ! empty( $iconData[ $icon ] ) ) {
                if ( ! isset( $iconData[ $icon ]['filter'] ) ) {
                    $iconData[ $icon ]['filter'] = array();
                } else {
                    if ( ! is_array( $iconData[ $icon ]['filter'] ) ) {
                        $iconData[ $icon ]['filter'] = array( $iconData[ $icon ]['filter'] );
                    }
                }
                if ( ! isset( $iconData[ $icon ]['categories'] ) ) {
                    $iconData[ $icon ]['categories'] = array();
                } else {
                    if ( ! is_array( $iconData[ $icon ]['categories'] ) ) {
                        $iconData[ $icon ]['categories'] = array( $iconData[ $icon ]['categories'] );
                    }
                }
                if ( ! isset( $iconData[ $icon ]['alias'] ) ) {
                    $iconData[ $icon ]['alias'] = array();
                } else {
                    if ( ! is_array( $iconData[ $icon ]['alias'] ) ) {
                        $iconData[ $icon ]['alias'] = array( $iconData[ $icon ]['alias'] );
                    }
                }
            } else {
                $iconData[ $icon ] = array(
                    'filter'     => array(),
                    'categories' => array(),
                    'alias'      => array(),
                );
            }

            if ( ! isset( $iconData[ $icon ]['created'] ) ) {
                $iconData[ $icon ]['created'] = "";
            }
        }

        ksort( $iconData );

        echo '<?php
    $iconData = ';
        var_export( $iconData );
        echo ';';
        exit();
    }


    require_once "spyc/spyc.php";
    $data    = array( 'icons' => array() );
    $newyaml = array();
    foreach ( $data['icons'] as $key => $value ) {
        if ( ! isset( $icons[ $value['id'] ] ) ) {
            unset( $data['icons'][ $key ] );
        } else {
            $data['icons'][ $key ]['unicode'] = $icons[ $value['id'] ];
            unset( $icons[ $value['id'] ] );
        }
    }

    // Add an empty item for new items

    if ( ! empty( $icons ) ) {
        foreach ( $icons as $icon => $unicode ) {
            $newIcon         = array(
                'name'    => $icon,
                'id'      => $icon,
                'unicode' => $unicode,
            );
            $data['icons'][] = $newIcon;
        }
    }

    // Adding in the filters and such.
    foreach ( $data['icons'] as $key => $icon ) {
        unset( $icon['categories'] );
        $icon                  = cleanIcon( $icon );
        $data['icons'][ $key ] = $icon;
    }


    /*


    echo 'icons:';
    foreach ( $data['icons'] as $icon ) {

        echo '
  - name:       \'' . $icon['name'] . '\'
    id:         \'' . $icon['id'] . '\'
    unicode:    ' . $icon['unicode'] . '
    created:    "' . $icon['created'].'"';
        if (isset($icon['filter'])) {
            echo '
    filter:';
            foreach ($icon['filter'] as $filter) {
                echo '
      - ' . $filter;
            }
        }
        if (isset($icon['alias'])) {
            echo '
    alias:';
            foreach ($icon['alias'] as $alias) {
                echo '
      - ' . $alias;
            }
        }
        if (isset($icon['categories'])) {
            echo '
    categories:';
            foreach ($icon['categories'] as $categories) {
                echo '
      - ' . $categories;
            }
        }
        echo '
';
    }

     */

    $yml_file = str_replace( '"', '', Spyc::YAMLDump( $data, 2, false, true ) );

    if ( isset( $_GET['yml_test'] ) ) {
        echo( $yml_file );
        exit();
    }


    file_put_contents( dirname( __FILE__ ) . '/../src/icons.yml', $yml_file );
    echo "built yaml...
";

    //    print_r($data);
